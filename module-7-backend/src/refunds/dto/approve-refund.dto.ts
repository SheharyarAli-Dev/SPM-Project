import { IsInt, IsPositive } from 'class-validator';

export class ApproveRefundDto {
  @IsInt()
  @IsPositive()
  admin_id: number;
}
