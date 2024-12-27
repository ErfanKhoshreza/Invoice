import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EmailConsumerService } from './email-consumer.service';

@Controller()
export class EmailConsumerController {
    constructor(private readonly emailConsumerService: EmailConsumerService) {}

    @EventPattern(process.env.RABBITMQ_QUEUE)
    async handleSalesSummaryReport(summaryReport: any) {
        await this.emailConsumerService.handleSalesSummaryReport(summaryReport);
    }
}
