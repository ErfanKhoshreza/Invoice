import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../../schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
    constructor(@InjectModel(Invoice.name) private invoiceModel: Model<Invoice>) {}

    async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        const newInvoice = new this.invoiceModel(createInvoiceDto);
        return newInvoice.save();
    }

    async findById(id: string): Promise<Invoice> {
        return this.invoiceModel.findById(id).exec();
    }

    async findAll(filters?: any): Promise<Invoice[]> {
        return this.invoiceModel.find(filters).exec();
    }
}