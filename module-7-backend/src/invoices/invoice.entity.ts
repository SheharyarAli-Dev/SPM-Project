import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invoice_number: string;

  @Column()
  milestone_payment_id: number;

  @Column()
  project_id: number;

  @Column()
  client_user_id: number;

  @Column()
  freelancer_user_id: number;

  @Column('decimal', { precision: 18, scale: 4 })
  gross_amount: number;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  platform_fee: number;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  tax_amount: number;

  @Column('decimal', { precision: 18, scale: 4 })
  net_amount: number;

  @Column()
  currency_code: string;

  @Column({ nullable: true })
  invoice_pdf_url: string;

  @CreateDateColumn()
  generated_at: Date;
}
