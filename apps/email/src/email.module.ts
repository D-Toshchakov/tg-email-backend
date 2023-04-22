import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from 'libs/common';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/email/.env'
    }),
    RmqModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
