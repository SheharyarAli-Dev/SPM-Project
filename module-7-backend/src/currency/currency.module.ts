import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { CurrencyRate } from './currency-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate])],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
