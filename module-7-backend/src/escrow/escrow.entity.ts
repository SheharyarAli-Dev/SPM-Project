import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('escrow_accounts')
export class Escrow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_id: number;

  @Column()
  client_user_id: number;

  @Column()
  freelancer_user_id: number;

  @Column()
  currency_code: string;

  @Column('decimal', { precision: 18, scale: 4 })
  total_amount: number;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  funded_amount: number;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  released_amount: number;

  @Column('decimal', { precision: 18, scale: 4, default: 0 })
  refunded_amount: number;

  @Column({ default: 'pending' })
  escrow_status: string;

  @Column({ nullable: true })
  funded_at: Date;

  @Column({ nullable: true })
  closed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
