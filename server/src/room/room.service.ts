import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import ApiError from "src/exceptions/api-error";
import { roomDTO } from "./dto";

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(data: roomDTO) {
    data.userIds = [...new Set(data.userIds)];
    const roomExists = await this.findByUserIds(data.userIds);
    if (roomExists) {
      return roomExists;
    }
    let endAvatar = [];
    let endName = "";
    if (data.userIds.length !== 2) {
      if (!data.avatar || data.avatar === "" || data.name === "" || !data.name)
        throw ApiError.badRequest("Avatar and name are required");
      endAvatar = [data.avatar];
      endName = data.name;
    } else {
      data.userIds.forEach(async (id) => {
        const user = await this.prisma.user.findUnique({
          where: {
            id,
          },
          select: {
            avatar: true,
            name: true,
          },
        });
        if (!user) {
          return ApiError.badRequest("User not found");
        }
        endAvatar.push(user.avatar);
        endName = user.name;
      });
    }
    const room = await this.prisma.room.create({
      data: {
        name: endName, // TODO: fix name for 2 users, the same way as avatar
        avatar: endAvatar,
        users: {
          connect: data.userIds.map((id) => ({ id })),
        },
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not created");
    }
    return {
      id: room.id,
    };
  }

  async getRoomById(id: string, callingId: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not found");
    }
    if (!room.isDeletable || room.userIds.length !== 2) return room;
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: room.userIds,
        },
      },
    });
    if (!users) {
      return ApiError.badRequest("User not found");
    }
    const user = users.find((user) => user.id !== callingId);
    if (!user) {
      return ApiError.badRequest("User not found");
    }
    const roomToReturn = {
      ...room,
      name: user.name,
      avatar: user.avatar,
    };
    return roomToReturn;
  }

  async getRoomByName(name: string) {
    // is not used yet
    const room = await this.prisma.room.findMany({
      where: {
        name,
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not found");
    }
    return room;
  }

  async getRoomMessages(id: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not found");
    }
    return room.messages;
  }

  async deleteRoom(id: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not found");
    }
    if (!room.isDeletable) {
      return ApiError.badRequest("Room is not deletable");
    }
    await this.prisma.room.delete({
      where: {
        id,
      },
    });
    if (room.id)
      return {
        message: "Room deleted",
      };
    else return ApiError.badRequest("Room not found");
  }

  async updateRoom(id: string, data: roomDTO) {
    const oldRoom = await this.prisma.room.findUnique({
      where: {
        id,
      },
    });
    if (!oldRoom) {
      return ApiError.badRequest("Room not found");
    }
    if (!oldRoom.isDeletable) {
      return ApiError.badRequest("Room cannot be updated");
    }
    if (oldRoom.userIds.length === 2) {
      if (data.userIds.length !== 2) {
        return ApiError.badRequest("You should provide name and avatar");
      }
    }
    const room = await this.prisma.room.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        users: {
          connect: data.userIds.map((id) => ({ id })),
        },
        avatar: [data.avatar],
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not found");
    }
    return {
      message: "Room updated",
    };
  }

  async getRoomsByUserId(id: string) {
    const rooms = await this.prisma.room.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            dateSent: "desc",
          },
          take: 1,
        },
      },
    });

    const endRooms = rooms.map(async (room) => {
      if (room.userIds.length === 2 && room.isDeletable) {
        const users = await this.prisma.user.findMany({
          where: {
            id: {
              in: room.userIds,
            },
          },
        });
        if (!users) {
          return ApiError.badRequest("User not found");
        }
        const user = users.find((user) => user.id !== id);
        if (!user) {
          return ApiError.badRequest("User not found");
        }

        return {
          ...room,
          name: user.name,
          avatar: user.avatar,
        };
      } else {
        return room;
      }
    });
    return Promise.all(endRooms);
  }

  private async findByUserIds(ids: string[]) {
    const rooms = await this.prisma.room.findMany({
      where: {
        users: {
          every: {
            id: {
              in: ids,
            },
          },
        },
      },
    });
    if (!rooms || rooms.length === 0) {
      return null;
    }
    const room = rooms
      .filter((room) => room.userIds.length === ids.length && room.isDeletable)
      .filter((room) => room.userIds.every((id) => ids.includes(id)))[0];
    if (!room) {
      return null;
    }
    return room;
  }
}
