import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';
import { RmqService } from 'libs/common';

async function bootstrap() {
  const app = await NestFactory.create(EmailModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('TELEGRAM'));
  await app.startAllMicroservices()
}
bootstrap();
