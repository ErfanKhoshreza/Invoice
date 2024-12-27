import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
    @IsNotEmpty()
    @IsString()
    sku: string;

    @IsPositive()
    @IsNumber()
    qt: number;
}

export class CreateInvoiceDto {
    @IsNotEmpty()
    @IsString()
    customer: string;

    @IsPositive()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    reference: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    items: ItemDto[];
}
