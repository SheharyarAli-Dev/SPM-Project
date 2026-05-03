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
  ForbiddenException,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CreateRefundDto } from './dto/create-refund.dto';
import { ApproveRefundDto } from './dto/approve-refund.dto';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) { }

  @Get()
  findAll(@Query('user_id') user_id?: string) {
    return this.refundsService.findAll(user_id ? +user_id : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundsService.findOne(+id);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(
    @Body() body: CreateRefundDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.refundsService.create(body, +userId);
  }

  @Patch(':id/approve')
  @UseGuards(OwnershipGuard)
  approve(@Param('id') id: string, @Body() body: ApproveRefundDto) {
    return this.refundsService.approve(+id, body.admin_id);
  }

  @Patch(':id/reject')
  @UseGuards(OwnershipGuard)
  reject(@Param('id') id: string, @Body() body: ApproveRefundDto) {
    return this.refundsService.reject(+id, body.admin_id);
  }
}
