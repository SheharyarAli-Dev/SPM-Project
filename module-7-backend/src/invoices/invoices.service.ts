import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) { }

  findAll(user_id: number) {
    return this.invoiceRepository.find({
      where: [{ client_user_id: user_id }, { freelancer_user_id: user_id }],
      order: { generated_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
    return invoice;
  }

  async create(body: {
    milestone_payment_id: number;
    project_id: number;
    client_user_id: number;
    freelancer_user_id: number;
    gross_amount: number;
    platform_fee?: number;
    tax_amount?: number;
    currency_code: string;
    invoice_pdf_url?: string;
  }, requesting_user_id?: number) {
    if (
      requesting_user_id &&
      body.client_user_id !== requesting_user_id &&
      body.freelancer_user_id !== requesting_user_id
    ) {
      throw new ForbiddenException('You can only create invoices for your own projects');
    }
    const platform_fee = body.platform_fee || body.gross_amount * 0.02;
    const tax_amount = body.tax_amount || 0;
    const net_amount = body.gross_amount - platform_fee - tax_amount;
    const invoice_number = `INV-${Date.now()}`;

    const invoice = this.invoiceRepository.create({
      ...body,
      platform_fee,
      tax_amount,
      net_amount,
      invoice_number,
    });
    return this.invoiceRepository.save(invoice);
  }
}
