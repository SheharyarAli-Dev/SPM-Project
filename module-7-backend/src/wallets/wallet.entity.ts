import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ default: 'USD' })
  currency_code: string;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  available_balance: number;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  held_balance: number;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  reserved_balance: number;

  @Column({ default: 'active' })
  wallet_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
