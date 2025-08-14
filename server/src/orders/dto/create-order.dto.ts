import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsISO8601,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContactDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

class ItemDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  qty!: number;

  @IsString()
  @IsOptional()
  note?: string;
}

class TotalsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  qty!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => ContactDto)
  contact!: ContactDto;

  @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    items!: ItemDto[];

  @ValidateNested()
  @Type(() => TotalsDto)
  totals!: TotalsDto;

  @IsISO8601()
  createdAt!: string;

  @IsBoolean()
  @IsOptional()
  marketingConsent?: boolean;
}
