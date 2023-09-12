import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import ApiError from "src/exceptions/api-error";
import { roomDTO } from "./dto";

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(data: roomDTO) {
    let endAvatar = [];

    if (data.userIDs.length !== 2) {
      if (!data.avatar || data.avatar === "")
        throw ApiError.badRequest("Avatar is required");
      endAvatar = [data.avatar];
    } else {
      data.userIDs.forEach(async (id) => {
        const user = await this.prisma.user.findUnique({
          where: {
            id,
          },
          select: {
            avatar: true,
          },
        });
        if (!user) {
          return ApiError.badRequest("User not found");
        }
        endAvatar.push(user.avatar);
      });
    }
    const room = await this.prisma.room.create({
      data: {
        name: data.name,
        users: {
          connect: data.userIDs.map((id) => ({ id })),
        },
        avatar: endAvatar,
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
    return {
      ...room,
      name: user.name,
      avatar: user.avatar,
    };
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
        messages: true,
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
      if (data.userIDs.length !== 2) {
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
          connect: data.userIDs.map((id) => ({ id })),
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
    const users = await this.prisma.user.findMany({
      where: {
        rooms: {
          some: {
            id,
          },
        },
      },
    });

    const endRooms = rooms.map((room) => {
      if (room.userIds.length === 2 && room.isDeletable) {
        const user = users.find((user) => user.id !== id);
        return {
          ...room,
          name: user.name,
          avatar: user.avatar,
        };
      } else {
        return room;
      }
    });
    return endRooms;
  }
}
