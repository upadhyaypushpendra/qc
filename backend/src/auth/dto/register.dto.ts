import { IsNotEmpty, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Matches(/^(\+?[\d\s\-()]{10,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/, {
    message: 'Identifier must be a valid email or phone number',
  })
  identifier: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
