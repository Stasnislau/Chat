import { Controller, Delete, Get, Post } from "@nestjs/common";
import { MessageService } from "./message.service";
import { messageDTO } from "./dto";
import ApiError from "src/exceptions/api-error";

@Controller("message")
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Post("create")
  async createMessage(data: messageDTO) {
    const message = await this.messageService.createMessage(data);
    if (message instanceof ApiError) {
      throw message;
    }
    return message;
  }
  
  @Get("getById/:id")
  async getMessageById(id: string) {
    const message = await this.messageService.getMessageById(id);
    if (message instanceof ApiError) {
      throw message;
    }
    return message;
  }
  @Get("getByText/:id")
  async getMessagesByText(text: string, roomId: string) {
    const messages = await this.messageService.getMessagesByText(text, roomId);
    if (messages instanceof ApiError) {
      throw messages;
    }
    return messages;
  }
  @Delete("delete/:id")
  async deleteMessage(id: string) {
    const message = await this.messageService.deleteMessage(id);
    if (message instanceof ApiError) {
      throw message;
    }
    return message;
  }
  @Post("update/:id")
  async updateMessage(id: string, data: messageDTO) {
    const message = await this.messageService.updateMessage(id, data);
    if (message instanceof ApiError) {
      throw message;
    }
    return message;
  }
}
