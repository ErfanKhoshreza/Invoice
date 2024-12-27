import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InvoicesService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) {}

    @Post()
    async create(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(createInvoiceDto);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.invoicesService.findById(id);
    }

    @Get()
    async findAll(@Query() filters: any) {
        return this.invoicesService.findAll(filters);
    }
}
