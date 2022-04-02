import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Transport} from '@nestjs/microservices';
import {Logger} from '@nestjs/common';



async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice(AppModule, {
  	 transport: Transport.RMQ,
      options:{
         urls: ['amqp://admin:admin@localhost:5672'],
        queue:'filas_martrank',
      },
  });

  await app.listen();
}
bootstrap();
