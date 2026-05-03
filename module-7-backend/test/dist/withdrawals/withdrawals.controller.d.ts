import { WithdrawalsService } from './withdrawals.service';
export declare class WithdrawalsController {
    private readonly withdrawalsService;
    constructor(withdrawalsService: WithdrawalsService);
    findAll(): Promise<import("./withdrawal.entity").Withdrawal[]>;
    findOne(id: string): Promise<import("./withdrawal.entity").Withdrawal>;
    create(body: {
        amount: number;
        payment_method_id: number;
        wallet_id: number;
        currency_code?: string;
    }, userId: string): Promise<import("./withdrawal.entity").Withdrawal>;
    approve(id: string): Promise<import("./withdrawal.entity").Withdrawal>;
    reject(id: string, body: {
        admin_note: string;
    }): Promise<import("./withdrawal.entity").Withdrawal>;
}
