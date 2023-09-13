import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { PrismaService } from "src/prisma/prisma.service";
import { message } from "@prisma/client";
import { Socket } from "socket.io";

@WebSocketGateway(8001, {
  cors: "*",
})
export class ChatGateway {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer() server;
  @SubscribeMessage("message")
  async handleMessage(@MessageBody() data: {
    message: message;
    room: string;
  }): Promise<void> {
    const { message, room } = data;
    if (room === "") return;
    else {
      this.server.to(room).emit("message", message);
    }
    console.log(message, "MESAGA");
    console.log(room, "KOMNATKA")
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
  }
  @SubscribeMessage("join-room")
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    if (room === "") return;
    else client.join(room);
  }
}
