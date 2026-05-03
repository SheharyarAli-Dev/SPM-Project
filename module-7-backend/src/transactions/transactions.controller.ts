import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // GET /transactions?wallet_id=1
  @Get()
  findAll(@Query('wallet_id') wallet_id: string) {
    return this.transactionsService.findAll(+wallet_id);
  }

  // GET /transactions/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }
}
