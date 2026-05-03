import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('payment_notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  transaction_id: number;

  @Column({ nullable: true })
  withdrawal_id: number;

  @Column({ nullable: true })
  refund_id: number;

  @Column()
  recipient_id: number;

  @Column()
  notification_type: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: 'in_app' })
  channel: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  sent_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
