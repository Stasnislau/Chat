import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import ApiError from "src/exceptions/api-error";
import { roomDTO } from "./dto";

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(data: roomDTO) {
    const room = await this.prisma.room.create({
      data: {
        name: data.name,
        users: {
          connect: data.userIDs.map((id) => ({ id })),
        },
        avatar: data.avatar,
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not created");
    }
    return {
      id: room.id,
    };
  }

  async getRoomById(id: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    });
    if (!room) {
      return ApiError.badRequest("Room not found");
    }
    return room;
  }

  async getRoomByName(name: string) {
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
    console.log("ZAEBALO")
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
    console.log(room.messages, 'VOT ONI DOROGIE')
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
    const room = await this.prisma.room.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        users: {
          connect: data.userIDs.map((id) => ({ id })),
        },
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
    if (!rooms) {
      return ApiError.badRequest("Rooms not found");
    }
    return rooms;
  }
}
