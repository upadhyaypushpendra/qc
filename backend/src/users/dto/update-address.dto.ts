import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @IsNotEmpty()
  line1: string;

  @IsOptional()
  line2: string;

  @IsOptional()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsNotEmpty()
  postcode: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  isDefault: boolean;
}
