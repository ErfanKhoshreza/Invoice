import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailConsumerService } from './email-consumer.service';
import { EmailConsumerController } from './email-consumer.controller';
import { EmailService } from '../invoices/email.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'RABBITMQ_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL],
                    queue: process.env.RABBITMQ_QUEUE,
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    controllers: [EmailConsumerController],
    providers: [EmailConsumerService, EmailService],
})
export class EmailConsumerModule {}
