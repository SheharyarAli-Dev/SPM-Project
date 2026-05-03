import { IsInt, IsPositive, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class FundWalletDto {
  @IsInt()
  @IsPositive()
  user_id: number;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  role?: string;
}
