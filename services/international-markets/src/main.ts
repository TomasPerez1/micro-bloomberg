import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true });

  // Necesario para que onApplicationShutdown corra con SIGTERM (docker stop) y el pool de pg cierre sus conexiones.
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 8080);
  await app.listen(port, '0.0.0.0');
  console.log(`international-markets escuchando en :${port}`);
}

await bootstrap();
