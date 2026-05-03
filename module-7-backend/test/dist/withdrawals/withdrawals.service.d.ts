import { Repository } from 'typeorm';
import { Withdrawal } from './withdrawal.entity';
export declare class WithdrawalsService {
    private withdrawalRepository;
    constructor(withdrawalRepository: Repository<Withdrawal>);
    findAll(): Promise<Withdrawal[]>;
    findOne(id: number): Promise<Withdrawal>;
    create(body: {
        amount: number;
        payment_method_id: number;
        wallet_id: number;
        currency_code?: string;
    }, requesting_user_id: number): Promise<Withdrawal>;
    approve(id: number): Promise<Withdrawal>;
    reject(id: number, admin_note: string): Promise<Withdrawal>;
}
