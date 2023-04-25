import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { PostEmailDto } from './dto/postEmailDto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('listen')
  getHello(@Body() body: PostEmailDto) { 
    return this.emailService.listen(body); 
  }
}
