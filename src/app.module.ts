import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './entities';
import { RQ_RS_FACTORY_SERVICE } from './interfaces';
import { RqRsFactoryService } from './services/rq-rs-factory.service';

/* -------------------------------------------------------------- */

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User],
        synchronize: configService.get('DB_SYNC').toLowerCase() === 'true',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      useClass: RqRsFactoryService, // You can switch useClass to different implementation
      provide: RQ_RS_FACTORY_SERVICE,
    },
    {
      provide: 'AUTH_TRANSPORT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SECURITY_HOST'),
            port: configService.get('SECURITY_PORT'),
          },
        }),
    },
    {
      provide: 'RABBIT_SERVICE_ZONES',
      useFactory: (configService: ConfigService) => {
        const queue_input = configService.get<string>('ZONES_QUEUE_INPUT');
        const host = configService.get<string>('ZONES_HOST');
        //const user = configService.get<string>('ZONES_USER')
        //const password = configService.get<string>('ZONES_PASSWORD')
        const port = parseInt(configService.get<string>('ZONES_PORT'));

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            //urls: [`amqp://${user}:${password}@${host}:${port}`],
            urls: [`amqp://${host}:${port}`],
            queue: `${queue_input}`,
            queueOptions: {
              durable: true, //persistent
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})

/* -------------------------------------------------------------- */
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

/* -------------------------------------------------------------- */
