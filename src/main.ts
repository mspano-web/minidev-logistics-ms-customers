import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

/* -------------------------------------------------- */

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const host = configService.get<string>('CUSTOMER_HOST');
  const port = parseInt(configService.get<string>('CUSTOMER_PORT'));

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  };

  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Cast automaticaly class-transform
    }),
  );

  await app.listen();
}

/* -------------------------------------------------- */

bootstrap();
