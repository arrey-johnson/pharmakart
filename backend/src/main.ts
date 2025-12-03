import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend and mobile app
  app.enableCors({
    origin: [
      'http://localhost:3000',        // Next.js web app
      'http://127.0.0.1:3000',        // Next.js web app
      'http://localhost:5173',        // Ionic dev server
      'http://192.168.1.251:5173',    // Ionic dev server (network)
      'capacitor://localhost',        // Ionic mobile app (iOS)
      'http://localhost',             // Ionic mobile app (Android)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 PharmaKart API running on http://localhost:${port}/api`);
}
bootstrap();
