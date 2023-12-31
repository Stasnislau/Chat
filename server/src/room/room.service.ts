import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import ApiError from "src/exceptions/api-error";
import { roomDTO } from "./dto";
import cloudinary from "../cloudinary";

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
    if (data.userIds.length === 1) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: data.userIds[0],
        },
        select: {
          avatar: true,
          name: true,
        },
      });
      if (!user) {
        return ApiError.badRequest("User not found");
      }
      endAvatar = [user.avatar];
      endName = "Saved messages";
    } else if (data.userIds.length !== 2) {
      if (!data.avatar || data.avatar === "" || data.name === "" || !data.name)
        throw ApiError.badRequest("Avatar and name are required");
      const promise = async (image) => {
        const res = await cloudinary.uploader.upload(
          data.avatar,
          {
            folder: "products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              return ApiError.badGateway("Unable to upload images");
            }
          }
        );
        return res.secure_url;
      };
      const avatar = await promise(data.avatar);

      endAvatar = [avatar];
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
        name: endName,
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
    if (!id || id === "") return ApiError.badRequest("Room id is required");
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not found");
    }
    if (!room.isDeletable || room.userIds.length !== 2)
      return {
        ...room,
        avatar: room.avatar[0],
      };
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
      isOnline: user.isOnline,
    };
    return roomToReturn;
  }

  async getRoomByName(name: string) {
    if (!name || name === "")
      return ApiError.badRequest("Room name is required");
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
    if (!id || id === "") return ApiError.badRequest("Room id is required");
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
    if (!id || id === "") return ApiError.badRequest("Room id is required");
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
    oldRoom.userIds.forEach((id) => {
      if (!data.userIds.includes(id)) {
        return ApiError.badRequest("You cannot remove users from this room");
      }
    });
    let avatar = oldRoom.avatar;
    if (data.avatar !== oldRoom.avatar[0]) {
      const promise = async (image) => {
        const res = await cloudinary.uploader.upload(
          data.avatar,
          {
            folder: "avatars",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              return ApiError.badGateway("Unable to upload images");
            }
          }
        );
        return [res.secure_url];
      };
      avatar = await promise(data.avatar);
    }
    const name = data.name === oldRoom.name ? oldRoom.name : data.name;

    const room = await this.prisma.room.update({
      where: {
        id,
      },
      data: {
        name: name,
        users: {
          connect: data.userIds.map((id) => ({ id })),
        },
        avatar: avatar,
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
        },
      },
    });

    const endRooms = rooms.map(async (room) => {
      let numberOfUnreadMessages = 0;
      room.messages.forEach((message) => {
        if (!message.isRead && message.userId !== id) {
          numberOfUnreadMessages++;
        }
      });
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
          messages: [room.messages[0]],
          numberOfUnreadMessages,
          isOnline: user.isOnline,
        };
      } else {
        return {
          ...room,
          messages: [room.messages[0]],
          numberOfUnreadMessages,
        };
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
