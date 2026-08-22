import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config.provider';
import { createAppLogger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config = app.get<AppConfig>('CONFIG');

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useLogger(createAppLogger(process.env.LOGGER_FORMAT));

  await app.listen(config.port);
}

void bootstrap();
