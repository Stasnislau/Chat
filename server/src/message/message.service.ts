import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import ApiError from "src/exceptions/api-error";
import { messageDTO } from "./dto";

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}
  async createMessage(data: messageDTO) {
    const message = await this.prisma.message.create({
      data: {
        text: data.text,
        user: {
          connect: {
            id: data.userId,
          },
        },
        room: {
          connect: {
            id: data.roomId,
          },
        },
      },
    });
    return message;
  }

  async getMessageById(id: string) {
    const message = await this.prisma.message.findUnique({
      where: {
        id,
      },
    });
    if (!message) {
      return new ApiError(404, "Message not found");
    }
    return message;
  }

  async getMessagesByText(text: string, roomId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        roomId,
        text: {
          contains: text,
        },
      },
    });
    return messages;
  }

  async deleteMessage(id: string) {
    const message = await this.prisma.message.delete({
      where: {
        id,
      },
    });
    if (!message) {
      return new ApiError(404, "Message not found");
    }
    return message;
  }

  async updateMessage(id: string, data: messageDTO) {
    const message = await this.prisma.message.update({
      where: {
        id,
      },
      data: {
        text: data.text,
      },
    });
    if (!message) {
      return new ApiError(404, "Message not found");
    }
    return message;
  }
}
