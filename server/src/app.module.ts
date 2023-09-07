import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ChatGateway } from './chat-gateway/chat.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [PrismaModule, UserModule, MessageModule, RoomModule],
  controllers: [AppController],
  providers: [ChatGateway],
})
export class AppModule {}
