import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyRate } from './currency-rate.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(CurrencyRate)
    private currencyRateRepository: Repository<CurrencyRate>,
  ) {}

  findAll() {
    return this.currencyRateRepository.find({
      where: { is_active: true },
      order: { fetched_at: 'DESC' },
    });
  }

  async findRate(base: string, target: string) {
    const rate = await this.currencyRateRepository.findOne({
      where: { base_currency: base, target_currency: target, is_active: true },
      order: { fetched_at: 'DESC' },
    });
    if (!rate)
      throw new NotFoundException(`Rate for ${base} to ${target} not found`);
    return rate;
  }

  async create(body: {
    base_currency: string;
    target_currency: string;
    exchange_rate: number;
    source_api: string;
  }) {
    const rate = this.currencyRateRepository.create(body);
    return this.currencyRateRepository.save(rate);
  }
}
