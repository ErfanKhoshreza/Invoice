import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Item {
    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    qt: number;
}

export class CreateInvoiceDto {
    @IsString()
    @IsNotEmpty()
    customer: string;

    @IsNumber()
    amount: number;

    @IsString()
    @IsNotEmpty()
    reference: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Item)
    items: Item[];
}
