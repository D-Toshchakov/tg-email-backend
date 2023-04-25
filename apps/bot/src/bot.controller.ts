import { Controller, Get } from '@nestjs/common';
import { BotService } from './bot.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';


type rmqTelegramDto = {
  from: string,
  subject: string,
  text: string,
}
@Controller()
export class BotController {
  constructor(private readonly botService: BotService, @InjectBot('EmailNotifierBot') private bot: Telegraf) {}

  @Get()
  getHello(): string {
    return this.botService.getHello();
  }

  @MessagePattern('new_message')
  async handleNewMessage(@Payload() {text, subject, from}: rmqTelegramDto, @Ctx() context: RmqContext) {

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    const msg = await this.bot.telegram.sendMessage('-618656969',  subject + '\n' + text + '\n' + from)
    channel.ack(originalMsg);
    console.log(text, subject, from);
  }
}
