import { Controller, Get } from '@nestjs/common';
import { BotService } from './bot.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get()
  getHello(): string {
    return this.botService.getHello();
  }

  @MessagePattern('new_message')
  handleNewMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
  }
}
