import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import ApiError from "src/exceptions/api-error";
import { userDTO } from "./dto";
import cloudinary from "../cloudinary";

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
    const promise = async (image) => {
      const res = await cloudinary.uploader.upload(
        image,
        {
          folder: "products",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return ApiError.badGateway("Unable to upload images");
          }
        }
      );
      return res.secure_url;
    };
    const avatar = await promise(data.avatar);
    const room = await this.prisma.room.findFirst({
      where: {
        isDeletable: false,
      },
      select: {
        id: true,
      }
    });
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        nickname: data.nickname,
        avatar: avatar,
        rooms: {
          connect: {
            id: room.id,
          },
        },
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

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
