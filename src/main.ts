import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[OK] API listening on http://localhost:${port}/api`);
}
bootstrap();
