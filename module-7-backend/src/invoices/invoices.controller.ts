import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @Get()
  findAll(@Query('user_id') user_id: string) {
    return this.invoicesService.findAll(+user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(+id);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(@Body() body: CreateInvoiceDto, @Headers('x-user-id') userId: string) {
    return this.invoicesService.create(body, +userId);
  }
}
