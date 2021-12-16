import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  WinstonModule
} from 'nest-winston';
import * as winston from 'winston';



async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.label(),
            winston.format.ms(),
            winston.format.printf(
              ({ context, Context, ms, level, ...info }) => {
                return `[${context ?? Context}] ${level?.toUpperCase()} ${ms}   ${JSON.stringify(info)}`;
              }
            )
          ),
        }),
      ]
    })
  });
  await app.listen(3000);
}
bootstrap();
