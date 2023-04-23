import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from 'libs/common/src';
import * as Joi from 'joi';
import { TELEGRAM_BOT_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_TELEGRAM_QUEUE: Joi.string().required(),
        PORT: Joi.number().required()
      }),
      envFilePath: './apps/email/.env'
    }),
    RmqModule.register({ name: TELEGRAM_BOT_SERVICE }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule { }
