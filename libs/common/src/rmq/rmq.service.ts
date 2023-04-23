import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RmqService {
    constructor(private readonly configService: ConfigService) {}

    getOptions(name: string, noAck = false) : RmqOptions {
        const rmqUri = this.configService.get('RABBIT_MQ_URI')
        return {
            transport: Transport.RMQ,
            options: {
                urls: [rmqUri],
                queue: this.configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                noAck,
                persistent: true,
            }
        }
    }
}