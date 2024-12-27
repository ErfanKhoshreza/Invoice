// src/modules/invoices/invoices.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../../schemas/invoice.schema';
import { InvoicesService } from './invoice.service';
import { InvoicesController } from './invoice.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    ],
    controllers: [InvoicesController],
    providers: [InvoicesService],
})
export class InvoicesModule {}
