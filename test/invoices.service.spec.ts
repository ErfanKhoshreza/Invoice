import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from 'src/modules/invoices/invoice.service';
import { getModelToken } from '@nestjs/mongoose';
import { Invoice } from 'src/schemas/invoice.schema';

describe('InvoicesService', () => {
    let service: InvoicesService;

    const mockInvoiceModel = {
        create: jest.fn(),
        findById: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoicesService,
                {
                    provide: getModelToken(Invoice.name),
                    useValue: mockInvoiceModel,
                },
            ],
        }).compile();

        service = module.get<InvoicesService>(InvoicesService);
    });

    it('should create an invoice', async () => {
        const createDto = { customer: 'Erfan', amount: 100, reference: 'REF123', items: [] };

        const mockCreatedInvoice = { ...createDto, _id: 'mockId' };
        mockInvoiceModel.create.mockResolvedValue(mockCreatedInvoice);

        const result = await service.create(createDto);

        expect(mockInvoiceModel.create).toHaveBeenCalledWith(createDto);
        expect(result).toEqual(mockCreatedInvoice);
    });

    it('should retrieve an invoice by ID', async () => {
        const mockInvoice = { _id: 'mockId', customer: 'Erfan', amount: 100 };

        mockInvoiceModel.exec.mockResolvedValue(mockInvoice);

        const result = await service.findById('mockId');

        expect(mockInvoiceModel.findById).toHaveBeenCalledWith('mockId');
        expect(result).toEqual(mockInvoice);
    });

    it('should retrieve all invoices', async () => {
        const mockInvoices = [
            { customer: 'Erfan', amount: 100 },
            { customer: 'Ali', amount: 200 },
        ];

        mockInvoiceModel.exec.mockResolvedValue(mockInvoices);

        const result = await service.findAll({});

        expect(mockInvoiceModel.find).toHaveBeenCalled();
        expect(result).toEqual(mockInvoices);
    });
});
