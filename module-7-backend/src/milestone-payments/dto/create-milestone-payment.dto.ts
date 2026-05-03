import {
  IsInt,
  IsPositive,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateMilestonePaymentDto {
  @IsInt()
  @IsPositive()
  escrow_id: number;

  @IsInt()
  @IsPositive()
  milestone_id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsDateString()
  due_date?: string;
}
