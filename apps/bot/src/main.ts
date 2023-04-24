import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';
import { RmqService } from 'libs/common/src';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice(rmqService.getOptions('TELEGRAM'))
  app.startAllMicroservices();
  // app.listen(3001)
}
bootstrap();
