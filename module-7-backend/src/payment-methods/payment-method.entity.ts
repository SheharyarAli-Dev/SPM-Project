import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  method_type: string;

  @Column()
  provider_name: string;

  @Column()
  account_title: string;

  @Column()
  account_number_masked: string;

  @Column()
  iban_or_wallet_id: string;

  @Column()
  country_code: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
