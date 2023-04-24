import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { RmqModule } from 'libs/common/src';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { TELEGRAM_BOT_SERVICE } from './constants/services';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppUpdate } from './bot.update';
import { sessionMiddleware } from './middleware/middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_TELEGRAM_QUEUE: Joi.string().required(),
      })
    }),
    TelegrafModule.forRoot({
      botName: 'EmailNotifierBot',
      token: process.env.TOKEN,
      middlewares: [sessionMiddleware],
    }),
    RmqModule.register({ name: TELEGRAM_BOT_SERVICE }),
    AppUpdate,
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule { }
