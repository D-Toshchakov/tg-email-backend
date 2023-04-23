import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';
import { RmqService } from 'libs/common/src';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(EmailModule);
  // const rmqService = app.get<RmqService>(RmqService);
  // app.connectMicroservice(rmqService.getOptions('TELEGRAM'));

  const configService = app.get(ConfigService)
  const PORT = configService.get('PORT')
  await app.listen(PORT)
  // await app.startAllMicroservices()
}
bootstrap();
