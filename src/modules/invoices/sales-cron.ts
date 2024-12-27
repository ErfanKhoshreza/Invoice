import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../../schemas/invoice.schema';
import { generateSalesSummary, SalesSummary } from './sale-summary';
import { EmailService } from './email.service';

@Injectable()
export class SalesSummaryCron {
    private readonly logger = new Logger(SalesSummaryCron.name);

    constructor(
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
        private readonly emailService: EmailService,
    ) {}

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

            const summaryReport: SalesSummary = {
                date: utcDate.toISOString().split('T')[0], // Ensure UTC date is used
                totalSales: invoices.reduce((sum, inv) => sum + inv.amount, 0),
                skuSummary: invoices.reduce((skuSummary, inv) => {
                    inv.items.forEach((item) => {
                        skuSummary[item.sku] = (skuSummary[item.sku] || 0) + item.qt;
                    });
                    return skuSummary;
                }, {}),
            };

            this.logger.log(`Daily Sales Summary: ${JSON.stringify(summaryReport)}`);

            // Send email with the summary
            const emailBodyText = `Date: ${summaryReport.date}\nTotal Sales: ${summaryReport.totalSales}\n`;
            const emailBodyHtml = `
      <h1>Daily Sales Summary</h1>
      <p>Date: ${summaryReport.date}</p>
      <p>Total Sales: ${summaryReport.totalSales}</p>
      <h2>SKU Summary:</h2>
      <ul>
        ${Object.entries(summaryReport.skuSummary)
                .map(([sku, quantity]) => `<li>${sku}: ${quantity}</li>`)
                .join('')}
      </ul>
    `;

            await this.emailService.sendSalesSummary(
                process.env.RECIPIENT_EMAIL || 'admin@example.com',
                'Daily Sales Summary',
                emailBodyText,
                emailBodyHtml,
            );

            this.logger.log('Mocked email sent with the sales summary.');
        } catch (error) {
            this.logger.error('Failed to process daily sales summary', error.stack);
        }
    }
}
