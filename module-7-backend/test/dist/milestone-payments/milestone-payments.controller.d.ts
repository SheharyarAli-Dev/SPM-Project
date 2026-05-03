import { MilestonePaymentsService } from './milestone-payments.service';
export declare class MilestonePaymentsController {
    private readonly milestonePaymentsService;
    constructor(milestonePaymentsService: MilestonePaymentsService);
    findAll(escrow_id: string): Promise<import("./milestone-payment.entity").MilestonePayment[]>;
    findOne(id: string): Promise<import("./milestone-payment.entity").MilestonePayment>;
    create(body: {
        escrow_id: number;
        milestone_id: number;
        title: string;
        amount: number;
        due_date?: Date;
    }): Promise<import("./milestone-payment.entity").MilestonePayment>;
    approve(id: string): Promise<import("./milestone-payment.entity").MilestonePayment>;
    reject(id: string): Promise<import("./milestone-payment.entity").MilestonePayment>;
    release(id: string): Promise<import("./milestone-payment.entity").MilestonePayment>;
}
