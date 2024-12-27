import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../invoices/email.service';

@Injectable()
export class EmailConsumerService {
    private readonly logger = new Logger(EmailConsumerService.name);

    constructor(private readonly emailService: EmailService) {}

    async handleSalesSummaryReport(summaryReport: any): Promise<void> {
        this.logger.log(`Received sales summary report: ${JSON.stringify(summaryReport)}`);

        const { date, totalSales, skuSummary } = summaryReport;

        const emailBodyText = `Date: ${date}\nTotal Sales: ${totalSales}\n`;
        const emailBodyHtml = `
      <h1>Daily Sales Summary</h1>
      <p>Date: ${date}</p>
      <p>Total Sales: ${totalSales}</p>
      <h2>SKU Summary:</h2>
      <ul>
        ${Object.entries(skuSummary)
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

        this.logger.log('Email sent with sales summary.');
    }
}
