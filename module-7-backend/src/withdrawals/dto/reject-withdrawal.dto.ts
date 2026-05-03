import { IsString, MinLength } from 'class-validator';

export class RejectWithdrawalDto {
  @IsString()
  @MinLength(1)
  admin_note: string;
}
