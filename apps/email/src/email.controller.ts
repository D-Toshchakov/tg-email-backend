import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('listen')
  getHello() {
    return this.emailService.getHello();
  }
}
