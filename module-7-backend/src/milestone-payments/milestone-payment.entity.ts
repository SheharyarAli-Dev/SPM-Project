import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('milestone_payments')
export class MilestonePayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  escrow_id: number;

  @Column()
  milestone_id: number;

  @Column()
  title: string;

  @Column('decimal', { precision: 18, scale: 4 })
  amount: number;

  @Column({ nullable: true })
  due_date: Date;

  @Column({ default: 'pending' })
  approval_status: string;

  @Column({ default: 'not_released' })
  release_status: string;

  @Column({ nullable: true })
  approved_at: Date;

  @Column({ nullable: true })
  released_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
