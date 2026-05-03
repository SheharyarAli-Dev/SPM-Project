import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('currency_rates')
export class CurrencyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  base_currency: string;

  @Column({ default: 'USD' })
  target_currency: string;

  @Column('decimal', { precision: 18, scale: 8 })
  exchange_rate: number;

  @Column()
  source_api: string;

  @CreateDateColumn()
  fetched_at: Date;

  @Column({ default: true })
  is_active: boolean;
}
