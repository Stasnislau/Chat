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
      },
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
  async searchUsersByNickname(nickname: string) {
    const users = await this.prisma.user.findMany({
      where: {
        nickname: {
          contains: nickname,
        },
      },
    });
    return users;
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
    if (data.avatar) {
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
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          avatar: avatar,
        },
      });
      const savedMessagesRoom = await this.prisma.room.findFirst({
        where: {
          userIds: {
            equals: [id],
          },
        },
        select: {
          id: true,
        },
      });
      if (savedMessagesRoom && savedMessagesRoom.id) {
        await this.prisma.room.update({
          where: {
            id: savedMessagesRoom.id,
          },
          data: {
            avatar: [avatar],
          },
        });
      }
      if (!user) {
        return ApiError.badRequest("User not found");
      }
      return {
        id: user.id,
      };
    }
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
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

  async getAvatars(roomId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        rooms: {
          some: {
            id: roomId,
          },
        },
      },
      select: {
        avatar: true,
        id: true,
      },
    });
    return users;
  }

  getUsers(ids: string[]) {
    return this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
