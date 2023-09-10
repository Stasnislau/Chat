import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json, urlencoded } from "express";
import * as dotenv from "dotenv";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3000",
  });
  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: "5mb" }));
  await app.listen(3001);
}
bootstrap();
