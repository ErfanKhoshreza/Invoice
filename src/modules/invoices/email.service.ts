import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    async sendSalesSummary(to: string, subject: string, text: string, html: string): Promise<void> {
        // Mocked email sending logic
        this.logger.log(`Mock email sent to ${to} with subject "${subject}"`);
        this.logger.debug(`Text Body: ${text}`);
        this.logger.debug(`HTML Body: ${html}`);
    }
}
