import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { PrismaService } from "src/prisma/prisma.service";
import { Socket } from "socket.io";
import { messageDTO } from "./dto";
import cloudinary from "../cloudinary";
import ApiError from "src/exceptions/api-error";
import { Readable } from "stream";
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';
@WebSocketGateway(8001, {
  cors: "*",
})
export class ChatGateway {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer() server;
  @SubscribeMessage("message")
  async handleMessage(
    @MessageBody() data: { message: messageDTO; room: string }
  ): Promise<void> {
    const { message, room } = data;
    if (room === "") return;
    if (!message.audio) {
      this.server.to(room).emit("message", message);
      await this.prisma.message.create({
        data: {
          text: message.text,
          isRead: false,
          user: {
            connect: {
              id: message.userId,
            },
          },
          room: {
            connect: {
              id: message.roomId,
            },
          },
        },
      });
    } else {
      const buffer = await streamToBuffer(Readable.from([message.audio]));
      const uploadOptions = {
        folder: "voice-messages",
        resource_type: "auto" as const,
      };
      cloudinary.uploader
        .upload_stream(uploadOptions, async (error, result) => {
          if (error) {
            return ApiError.badGateway("Unable to upload images");
          }
          const audioUrl = result.secure_url;
          this.server.to(room).emit("message", { ...message, audioUrl });
          await this.prisma.message.create({
            data: {
              text: message.text,
              isRead: false,
              audioUrl: audioUrl,
              user: {
                connect: {
                  id: message.userId,
                },
              },
              room: {
                connect: {
                  id: message.roomId,
                },
              },
            },
          });
        })
        .end(buffer);
    }
  }
  @SubscribeMessage("join-room")
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    if (room === "") return;
    else client.join(room);
  }
  @SubscribeMessage("online-status")
  async handleOnline(
    @MessageBody() data: { userId: string; isOnline: boolean },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const { userId, isOnline } = data;
    client.join(userId);
    const rooms = await this.prisma.room.findMany({
      where: {
        userIds: {
          has: userId,
        },
      },
    });
    if (!rooms) return;
    if (rooms.length > 0) {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isOnline: isOnline,
        },
      });
      if (!user) return;
    }
    rooms.forEach((room) => {
      client.to(room.id).emit("changed-online-status", room.id);
    });
  }
  @SubscribeMessage("read-message")
  async handleReadMessage(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    if (!data || !data.messageId) return;
    await this.prisma.message.update({
      where: {
        id: data.messageId,
      },
      data: {
        isRead: true,
      },
    });
    client.emit("read-message", data.messageId);
  }
}