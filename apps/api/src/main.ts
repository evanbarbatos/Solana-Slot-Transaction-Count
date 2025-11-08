import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3003';
  const port = Number(process.env.API_PORT || 3002);
  app.enableCors({ origin: corsOrigin });
  await app.listen(port);
}

bootstrap();