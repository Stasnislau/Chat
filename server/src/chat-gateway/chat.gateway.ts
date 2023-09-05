import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

@WebSocketGateway(8001, {
  cors: "*",
})
export class ChatGateway {
  @WebSocketServer() server;
  @SubscribeMessage("message")
  handleMessage(@MessageBody() message: string): void {
    this.server.emit("message", message);
  }
}
