import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../../schemas/invoice.schema';
import { ClientProxy, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { generateSalesSummary, SalesSummary } from './sale-summary';
import { EmailService } from './email.service';

@Injectable()
export class SalesSummaryCron {
    private readonly logger = new Logger(SalesSummaryCron.name);
    private readonly client: ClientProxy;

    constructor(
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    ) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL],
                queue: process.env.RABBITMQ_QUEUE,
                queueOptions: {
                    durable: true,
                },
            },
        });
    }

    @Cron('0 12 * * *') // Runs daily at 12:00 PM
    async handleCron(): Promise<void> {
        this.logger.log('Running daily sales summary cron job...');

        try {
            const today = new Date();
            const utcDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
            const tomorrow = new Date(utcDate);
            tomorrow.setUTCDate(utcDate.getUTCDate() + 1);

            const invoices = await this.invoiceModel.find({
                date: { $gte: utcDate, $lt: tomorrow },
            }).exec();

            const summaryReport: SalesSummary = await generateSalesSummary(invoices);

            this.logger.log(`Publishing daily sales summary to RabbitMQ: ${JSON.stringify(summaryReport)}`);

            await this.client.emit(process.env.RABBITMQ_QUEUE, summaryReport).toPromise();

            this.logger.log('Sales summary published to RabbitMQ.');
        } catch (error) {
            this.logger.error('Failed to publish daily sales summary', error.stack);
        }
    }
}
