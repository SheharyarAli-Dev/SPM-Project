import { IsInt, IsPositive, IsString, Length, IsNumber } from 'class-validator';

export class CreateEscrowDto {
  @IsInt()
  @IsPositive()
  project_id: number;

  @IsInt()
  @IsPositive()
  client_user_id: number;

  @IsInt()
  @IsPositive()
  freelancer_user_id: number;

  @IsString()
  @Length(3, 3)
  currency_code: string;

  @IsNumber()
  @IsPositive()
  total_amount: number;
}
