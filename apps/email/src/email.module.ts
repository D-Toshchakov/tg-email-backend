import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from 'libs/common';
import * as Joi from 'joi';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_TELEGRAM_QUEUE: Joi.string().required(),
        PORT: Joi.number().required()
      }),
      envFilePath: './apps/email/.env'
    }),
    RmqModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
