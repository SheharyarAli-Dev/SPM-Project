import { IsString, Length, IsUppercase, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class CreateCurrencyRateDto {
  @IsString()
  @Length(3, 3)
  @IsUppercase()
  base_currency: string;

  @IsString()
  @Length(3, 3)
  @IsUppercase()
  target_currency: string;

  @IsNumber()
  @IsPositive()
  exchange_rate: number;

  @IsString()
  @MaxLength(100)
  source_api: string;
}
