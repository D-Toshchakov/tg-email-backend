import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from 'libs/common/src';

@Injectable()
export class BotService {

  getHello(): string {
    return 'Hello World!';
  }
}
