import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PaymentMethod } from './payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  findAll(user_id: number) {
    return this.paymentMethodRepository.find({
      where: { user_id, deleted_at: IsNull() },
    });
  }

  async create(body: {
    user_id: number;
    method_type: string;
    provider_name: string;
    account_title: string;
    account_number_masked: string;
    iban_or_wallet_id: string;
    country_code: string;
  }) {
    const method = this.paymentMethodRepository.create(body);
    return this.paymentMethodRepository.save(method);
  }

  async setDefault(id: number, user_id: number) {
    await this.paymentMethodRepository.update(
      { user_id },
      { is_default: false },
    );
    const method = await this.paymentMethodRepository.findOne({
      where: { id },
    });
    if (!method) throw new NotFoundException(`Payment method ${id} not found`);
    method.is_default = true;
    return this.paymentMethodRepository.save(method);
  }

  async remove(id: number) {
    const method = await this.paymentMethodRepository.findOne({
      where: { id },
    });
    if (!method) throw new NotFoundException(`Payment method ${id} not found`);
    method.deleted_at = new Date();
    return this.paymentMethodRepository.save(method);
  }
}
