import {
  IsInt,
  IsPositive,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateRefundDto {
  @IsInt()
  @IsPositive()
  transaction_id: number;

  @IsInt()
  @IsPositive()
  escrow_id: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  milestone_payment_id?: number;

  @IsInt()
  @IsPositive()
  requested_by: number;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  reason: string;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  refund_amount: number;
}
