import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatGateway } from './chat-gateway/chat.gateway';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { RoomService } from './room/room.service';
import { RoomModule } from './room/room.module';

@Module({
  imports: [PrismaModule, UserModule, MessageModule, RoomModule],
  controllers: [AppController, MessageController],
  providers: [AppService, ChatGateway, ChatGateway, PrismaService, RoomService],
})
export class AppModule {}
