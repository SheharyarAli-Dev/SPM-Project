import { Repository } from 'typeorm';
import { Refund } from './refund.entity';
export declare class RefundsService {
    private refundRepository;
    constructor(refundRepository: Repository<Refund>);
    findAll(): Promise<Refund[]>;
    findOne(id: number): Promise<Refund>;
    create(body: {
        transaction_id: number;
        escrow_id: number;
        milestone_payment_id?: number;
        requested_by: number;
        reason: string;
        refund_amount: number;
    }, requesting_user_id: number): Promise<Refund>;
    approve(id: number, admin_id: number): Promise<Refund>;
    reject(id: number, admin_id: number): Promise<Refund>;
}
