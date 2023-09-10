import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import ApiError from "src/exceptions/api-error";
import { userDTO } from "./dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: userDTO) {
    const ifExist = await this.prisma.user.findUnique({
      where: {
        nickname: data.nickname,
      },
    });
    if (ifExist) {
      return ApiError.badRequest("User already exist");
    }
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        nickname: data.nickname,
        avatar: data.avatar,
      },
    });
    if (!user) {
      return ApiError.badRequest("User not created");
    }
    return {
      id: user.id,
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return ApiError.badRequest("User not found");
    }
    return user;
  }

  async getUserByNickname(nickname: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        nickname,
      },
    });
    if (!user) {
      return ApiError.badRequest("User not found");
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    if (!user) {
      return ApiError.badRequest("User not found");
    }
    return {
      id: user.id,
    };
  }

  async updateUser(id: string, data: userDTO) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        nickname: data.nickname,
        avatar: data.avatar,
      },
    });
    if (!user) {
      return ApiError.badRequest("User not found");
    }
    return {
      id: user.id,
    };
  }

}
