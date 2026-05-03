import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('withdrawal_requests')
export class Withdrawal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  wallet_id: number;

  @Column()
  payment_method_id: number;

  @Column({ nullable: true })
  transaction_id: number;

  @Column('decimal', { precision: 18, scale: 4 })
  amount: number;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  processing_fee: number;

  @Column('decimal', { precision: 18, scale: 4 })
  net_amount: number;

  @Column({ default: 'USD' })
  currency_code: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  requested_at: Date;

  @Column({ nullable: true })
  processed_at: Date;

  @Column({ nullable: true })
  admin_note: string;
}
