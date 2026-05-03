import { Repository } from 'typeorm';
import { MilestonePayment } from './milestone-payment.entity';
export declare class MilestonePaymentsService {
    private milestonePaymentRepository;
    constructor(milestonePaymentRepository: Repository<MilestonePayment>);
    findAll(escrow_id: number): Promise<MilestonePayment[]>;
    findOne(id: number): Promise<MilestonePayment>;
    create(body: {
        escrow_id: number;
        milestone_id: number;
        title: string;
        amount: number;
        due_date?: Date;
    }): Promise<MilestonePayment>;
    approve(id: number): Promise<MilestonePayment>;
    reject(id: number): Promise<MilestonePayment>;
    release(id: number): Promise<MilestonePayment>;
}
