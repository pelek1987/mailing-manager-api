import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port: string = process.env.PORT;
  await app.listen(port, () => {
    console.log(`[Nest] Server is running at http://localhost:${port}`);
  });
}
bootstrap();
