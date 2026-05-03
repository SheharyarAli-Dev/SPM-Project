import { IsInt, IsPositive } from 'class-validator';

export class SetDefaultPaymentDto {
  @IsInt()
  @IsPositive()
  user_id: number;
}
