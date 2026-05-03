import {
  IsInt,
  IsPositive,
  IsString,
  Length,
  IsNumber,
  Min,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsInt()
  @IsPositive()
  milestone_payment_id: number;

  @IsInt()
  @IsPositive()
  project_id: number;

  @IsInt()
  @IsPositive()
  client_user_id: number;

  @IsInt()
  @IsPositive()
  freelancer_user_id: number;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  gross_amount: number;

  @IsString()
  @Length(3, 3)
  currency_code: string;

  @IsOptional()
  @IsUrl()
  invoice_pdf_url?: string;
}
