import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) { }

  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get('rate')
  findRate(@Query('base') base: string, @Query('target') target: string) {
    return this.currencyService.findRate(base, target);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateCurrencyRateDto) {
    return this.currencyService.create(body);
  }
}
