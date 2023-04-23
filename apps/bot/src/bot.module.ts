import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { RmqModule } from 'libs/common/src';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { TELEGRAM_BOT_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_TELEGRAM_QUEUE: Joi.string().required(),
      })
    }),
    RmqModule.register({name: TELEGRAM_BOT_SERVICE}),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
