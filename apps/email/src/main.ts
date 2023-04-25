import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(EmailModule);
  const configService = app.get(ConfigService)
  const PORT = configService.get('PORT')
  app.enableCors();
  await app.listen(PORT)
}
bootstrap();
