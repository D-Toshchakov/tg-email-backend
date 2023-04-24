import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TELEGRAM_BOT_SERVICE } from './constants/services';

@Injectable()
export class EmailService {
  constructor(@Inject(TELEGRAM_BOT_SERVICE) private emailClient: ClientProxy) { }

  async getHello(): Promise<string> {
    await lastValueFrom(this.emailClient.emit('new_message', {text: 'new text'}))
    // const record = new RmqRecordBuilder('some text')
    //   .setOptions({
    //     priority: 3,
    //   })
    //   .build();

    // this.emailClient.send('replace-emoji', record);
    return 'started listening'
  }
}
