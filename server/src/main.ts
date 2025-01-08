import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://127.0.0.1:5501', // Replace with your frontend URL
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow the Authorization header
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary methods
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
