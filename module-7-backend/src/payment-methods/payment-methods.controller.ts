import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }

  @Get()
  findAll(@Query('user_id') user_id: string) {
    return this.paymentMethodsService.findAll(+user_id);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(@Body() body: CreatePaymentMethodDto) {
    return this.paymentMethodsService.create(body);
  }

  @Patch(':id/set-default')
  @UseGuards(OwnershipGuard)
  setDefault(@Param('id') id: string, @Body() body: { user_id: number }) {
    return this.paymentMethodsService.setDefault(+id, body.user_id);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  remove(@Param('id') id: string) {
    return this.paymentMethodsService.remove(+id);
  }
}
