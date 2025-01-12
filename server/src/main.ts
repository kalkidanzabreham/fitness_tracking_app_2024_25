import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow requests from any origin
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow the Authorization header
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary methods
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
