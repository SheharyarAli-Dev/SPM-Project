import { IsInt, IsPositive, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  @IsPositive()
  recipient_id: number;

  @IsString()
  @MaxLength(50)
  notification_type: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  transaction_id?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  withdrawal_id?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  refund_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  channel?: string;
}
