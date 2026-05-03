import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    findAll(user_id: string): Promise<import("./invoice.entity").Invoice[]>;
    findOne(id: string): Promise<import("./invoice.entity").Invoice>;
    create(body: {
        milestone_payment_id: number;
        project_id: number;
        client_user_id: number;
        freelancer_user_id: number;
        gross_amount: number;
        platform_fee?: number;
        tax_amount?: number;
        currency_code: string;
    }): Promise<import("./invoice.entity").Invoice>;
}
