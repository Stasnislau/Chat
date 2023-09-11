import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.room.create({
    data: {
      isDeletable: false,
      name: "General",
      avatar:
        "https://res.cloudinary.com/dynvxyzec/image/upload/v1694443047/general_zxioom.png",
    },
  });
}

seed();
