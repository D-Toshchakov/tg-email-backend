import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RmqService {
    constructor(private readonly configService: ConfigService) {}

    getOptions(name: string, noAck = false) : RmqOptions {
        const USER = this.configService.get('RABBITMQ_USER');
        const PASSWORD = this.configService.get('RABBITMQ_PASS');
        const HOST = this.configService.get('RABBITMQ_HOST');
        const rabbitMqUrl = this.configService.get('RABBIT_MQ_URI')
        return {
            transport: Transport.RMQ,
            options: {
                urls: [rabbitMqUrl],
                queue: this.configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                noAck,
                persistent: true,
            }
        }
    }
}