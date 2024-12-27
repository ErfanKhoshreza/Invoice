import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { InvoicesService } from 'src/modules/invoices/invoice.service';

describe('InvoicesController (e2e)', () => {
    let app: INestApplication;

    const mockInvoicesService = {
        create: jest.fn().mockResolvedValue({ id: 'mockId', customer: 'Erfan', amount: 100 }),
        findById: jest.fn().mockResolvedValue({ id: 'mockId', customer: 'Erfan', amount: 100 }),
        findAll: jest.fn().mockResolvedValue([{ id: 'mockId', customer: 'Erfan', amount: 100 }]),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(InvoicesService)
            .useValue(mockInvoicesService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/POST invoices (should create an invoice)', async () => {
        return request(app.getHttpServer())
            .post('/invoices')
            .send({ customer: 'Erfan', amount: 100, reference: 'REF123', items: [] })
            .expect(201)
            .expect({
                id: 'mockId',
                customer: 'Erfan',
                amount: 100,
            });
    });

    it('/GET invoices/:id (should retrieve an invoice)', async () => {
        return request(app.getHttpServer())
            .get('/invoices/mockId')
            .expect(200)
            .expect({
                id: 'mockId',
                customer: 'Erfan',
                amount: 100,
            });
    });

    it('/GET invoices (should retrieve all invoices)', async () => {
        return request(app.getHttpServer())
            .get('/invoices')
            .expect(200)
            .expect([{ id: 'mockId', customer: 'Erfan', amount: 100 }]);
    });

    afterAll(async () => {
        await app.close();
    });
});
