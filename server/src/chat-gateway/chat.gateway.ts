import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { PrismaService } from "src/prisma/prisma.service";
import { message } from "@prisma/client";

@WebSocketGateway(8001, {
  cors: "*",
})
export class ChatGateway {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer() server;
  @SubscribeMessage("message")
  handleMessage(@MessageBody() message: message): void {
    this.server.emit("message", message);
    this.prisma.message.create({
      data: {
        text: message.text,
        userId: message.userId,
        roomId: message.roomId,
      },
    });
  }
}
