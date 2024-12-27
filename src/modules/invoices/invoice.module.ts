import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../../schemas/invoice.schema';
import { InvoicesService } from './invoice.service';
import { InvoicesController } from './invoice.controller';
import { SalesSummaryCron } from './sales-cron';
import {EmailService} from "./email.service"

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Invoice.name, schema: InvoiceSchema },]),
    ],
    controllers: [InvoicesController],
    providers: [InvoicesService,SalesSummaryCron,EmailService],
})
export class InvoicesModule {}
