import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatGateway } from './chat-gateway/chat.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatGateway],
})
export class AppModule {}
