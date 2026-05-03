import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
export declare class InvoicesService {
    private invoiceRepository;
    constructor(invoiceRepository: Repository<Invoice>);
    findAll(user_id: number): Promise<Invoice[]>;
    findOne(id: number): Promise<Invoice>;
    create(body: {
        milestone_payment_id: number;
        project_id: number;
        client_user_id: number;
        freelancer_user_id: number;
        gross_amount: number;
        platform_fee?: number;
        tax_amount?: number;
        currency_code: string;
    }): Promise<Invoice>;
}
