import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { RejectWithdrawalDto } from './dto/reject-withdrawal.dto';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) { }

  @Get()
  findAll(@Query('user_id') user_id?: string) {
    return this.withdrawalsService.findAll(user_id ? +user_id : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawalsService.findOne(+id);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(
    @Body() body: CreateWithdrawalDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.withdrawalsService.create(body, +userId);
  }

  @Patch(':id/approve')
  @UseGuards(OwnershipGuard)
  approve(@Param('id') id: string) {
    return this.withdrawalsService.approve(+id);
  }

  @Patch(':id/reject')
  @UseGuards(OwnershipGuard)
  reject(@Param('id') id: string, @Body() body: RejectWithdrawalDto) {
    return this.withdrawalsService.reject(+id, body.admin_note);
  }
}
