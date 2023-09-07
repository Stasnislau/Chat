import { Body, Controller, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { userDTO } from "./dto";
import ApiError from "src/exceptions/api-error";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("create")
  async createUser(@Body() data: userDTO) {
    const user = await this.userService.createUser(data);
    if (user instanceof ApiError) {
      throw user;
    }
    return user;
  }

  @Post("getById/:id")
  async getUserById(@Param("id") id: string) {
    const user = await this.userService.getUserById(id);
    if (user instanceof ApiError) {
      throw user;
    }
    return user;
  }

  @Post("getByNickname/:nickname")
  async getUserByNickname(@Param("nickname") nickname: string) {
    const user = await this.userService.getUserByNickname(nickname);
    if (user instanceof ApiError) {
      throw user;
    }
    return user;
  }

  @Post("delete/:id")
  async deleteUser(@Param("id") id: string) {
    const user = await this.userService.deleteUser(id);
    if (user instanceof ApiError) {
      throw user;
    }
    return user;
  }

  @Post("update/:id")
  async updateUser(@Param("id") id: string, @Body() data: userDTO) {
    const user = await this.userService.updateUser(id, data);
    if (user instanceof ApiError) {
      throw user;
    }
    return user;
  }
}
