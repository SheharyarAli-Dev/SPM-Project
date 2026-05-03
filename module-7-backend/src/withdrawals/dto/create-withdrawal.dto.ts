import { IsInt, IsPositive, IsNumber, Min, IsOptional, IsString, Length } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @IsInt()
  @IsPositive()
  payment_method_id: number;

  @IsInt()
  @IsPositive()
  wallet_id: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency_code?: string;
}
