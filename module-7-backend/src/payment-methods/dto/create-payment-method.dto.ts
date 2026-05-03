import { IsInt, IsPositive, IsString, MaxLength, Length } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsInt()
  @IsPositive()
  user_id: number;

  @IsString()
  @MaxLength(20)
  method_type: string;

  @IsString()
  @MaxLength(100)
  provider_name: string;

  @IsString()
  @MaxLength(200)
  account_title: string;

  @IsString()
  @MaxLength(50)
  account_number_masked: string;

  @IsString()
  iban_or_wallet_id: string;

  @IsString()
  @Length(2, 2)
  country_code: string;
}
