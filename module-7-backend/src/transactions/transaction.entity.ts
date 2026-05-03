import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wallet_id: number;

  @Column({ nullable: true })
  escrow_id: number;

  @Column({ nullable: true })
  invoice_id: number;

  @Column({ nullable: true })
  sender_user_id: number;

  @Column({ nullable: true })
  receiver_user_id: number;

  @Column()
  transaction_type: string;

  @Column('decimal', { precision: 18, scale: 4 })
  amount: number;

  @Column()
  currency_code: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  reference_no: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  processed_at: Date;
}
