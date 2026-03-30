import { IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  identifier: string;

  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
