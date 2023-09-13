import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Put,
  Delete,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import ApiError from "src/exceptions/api-error";
import { roomDTO } from "./dto";

@Controller("room")
export class RoomController {
  constructor(private roomService: RoomService) {}
  @Post("create")
  async createRoom(@Body() data: roomDTO) {
    const room = await this.roomService.createRoom(data);
    if (room instanceof ApiError) {
      throw room;
    }
    return room;
  }

  @Post("getById/:id")
  async getRoomById(@Param("id") id: string, @Body() callingId: string) {
    const room = await this.roomService.getRoomById(id, callingId);
    if (room instanceof ApiError) {
      throw room;
    }
    return room;
  }

  @Get("getByName/:name")
  async getRoomByName(@Param("name") name: string) {
    const room = await this.roomService.getRoomByName(name);
    if (room instanceof ApiError) {
      throw room;
    }
    return room;
  }

  @Get("getMessages/:id")
  async getRoomMessages(@Param("id") id: string) {
    const room = await this.roomService.getRoomMessages(id);
    if (room instanceof ApiError) {
      throw room;
    }
    return room;
  }

  @Delete("delete/:id")
  async deleteRoom(@Param("id") id: string) {
    const room = await this.roomService.deleteRoom(id);
    if (room instanceof ApiError) {
      throw room;
    }
    return room;
  }

  @Put("update/:id")
  async updateRoom(@Param("id") id: string, @Body() data: roomDTO) {
    const room = await this.roomService.updateRoom(id, data);
    if (room instanceof ApiError) {
      throw room;
    }
    return room;
  }

  @Get("getByUserId/:id")
  async getRoomsByUserId(@Param("id") id: string) {
    const room = await this.roomService.getRoomsByUserId(id);
    if (room instanceof ApiError) {
      throw room;
    }
    return room;
  }

  @Post("checkRoom")
  async checkRoom(@Body() ids: string[]) {
    const room = await this.roomService.checkIfRoomExists(ids);
    return room;
  }
}
