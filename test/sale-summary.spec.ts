import { Test, TestingModule } from '@nestjs/testing';
import { SalesSummaryCron } from 'src/modules/invoices/sales-cron';
import { getModelToken } from '@nestjs/mongoose';
import { Invoice } from 'src/schemas/invoice.schema';
import { EmailService } from 'src/modules/invoices/email.service';

describe('SalesSummaryCron', () => {
    let cronService: SalesSummaryCron;

    const mockInvoiceModel = {
        find: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    const mockEmailService = {
        sendSalesSummary: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SalesSummaryCron,
                {
                    provide: getModelToken(Invoice.name),
                    useValue: mockInvoiceModel,
                },
                {
                    provide: EmailService,
                    useValue: mockEmailService,
                },
            ],
        }).compile();

        cronService = module.get<SalesSummaryCron>(SalesSummaryCron);
    });

    it('should trigger email sending after processing the summary', async () => {
        const mockInvoices = [
            { amount: 100, items: [{ sku: 'ITEM001', qt: 2 }] },
            { amount: 200, items: [{ sku: 'ITEM002', qt: 3 }] },
        ];

        const utcDate = new Date();
        const expectedSummary = {
            date: new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate()))
                .toISOString()
                .split('T')[0],
            totalSales: 300,
            skuSummary: {
                ITEM001: 2,
                ITEM002: 3,
            },
        };

        mockInvoiceModel.exec.mockResolvedValue(mockInvoices);

        await cronService.handleCron();



        expect(mockInvoiceModel.find).toHaveBeenCalledWith({
            date: { $gte: expect.any(Date), $lt: expect.any(Date) },
        });

        expect(mockEmailService.sendSalesSummary).toHaveBeenCalledWith(
            expect.any(String),
            'Daily Sales Summary',
            expect.stringContaining(`Date: ${expectedSummary.date}\nTotal Sales: ${expectedSummary.totalSales}`),
            expect.stringContaining('<h1>Daily Sales Summary</h1>'),
        );
    });
});
