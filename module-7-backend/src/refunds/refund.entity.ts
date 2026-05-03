import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('refund_requests')
export class Refund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_id: number;

  @Column()
  escrow_id: number;

  @Column({ nullable: true })
  milestone_payment_id: number;

  @Column()
  requested_by: number;

  @Column({ nullable: true })
  approved_by_admin: number;

  @Column()
  reason: string;

  @Column('decimal', { precision: 18, scale: 4 })
  refund_amount: number;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  resolved_at: Date;
}
