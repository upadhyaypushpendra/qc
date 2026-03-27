import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 20;

  @IsOptional()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  sort: string; // 'price_asc', 'price_desc', 'newest'

  @IsOptional()
  @Type(() => Boolean)
  inStock: boolean;
}
