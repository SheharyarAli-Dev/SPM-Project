import { RefundsService } from './refunds.service';
export declare class RefundsController {
    private readonly refundsService;
    constructor(refundsService: RefundsService);
    findAll(): Promise<import("./refund.entity").Refund[]>;
    findOne(id: string): Promise<import("./refund.entity").Refund>;
    create(body: {
        transaction_id: number;
        escrow_id: number;
        milestone_payment_id?: number;
        requested_by: number;
        reason: string;
        refund_amount: number;
    }, userId: string): Promise<import("./refund.entity").Refund>;
    approve(id: string, body: {
        admin_id: number;
    }): Promise<import("./refund.entity").Refund>;
    reject(id: string, body: {
        admin_id: number;
    }): Promise<import("./refund.entity").Refund>;
}
