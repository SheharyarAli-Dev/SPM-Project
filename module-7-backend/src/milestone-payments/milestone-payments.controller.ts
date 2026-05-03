import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MilestonePaymentsService } from './milestone-payments.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CreateMilestonePaymentDto } from './dto/create-milestone-payment.dto';

@Controller('milestone-payments')
export class MilestonePaymentsController {
  constructor(
    private readonly milestonePaymentsService: MilestonePaymentsService,
  ) { }

  @Get()
  findAll(@Query('escrow_id') escrow_id: string) {
    return this.milestonePaymentsService.findAll(+escrow_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.milestonePaymentsService.findOne(+id);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(@Body() body: CreateMilestonePaymentDto) {
    return this.milestonePaymentsService.create(body);
  }

  @Patch(':id/approve')
  @UseGuards(OwnershipGuard)
  approve(@Param('id') id: string) {
    return this.milestonePaymentsService.approve(+id);
  }

  @Patch(':id/reject')
  @UseGuards(OwnershipGuard)
  reject(@Param('id') id: string) {
    return this.milestonePaymentsService.reject(+id);
  }

  @Patch(':id/release')
  @UseGuards(OwnershipGuard)
  release(@Param('id') id: string) {
    return this.milestonePaymentsService.release(+id);
  }
}
