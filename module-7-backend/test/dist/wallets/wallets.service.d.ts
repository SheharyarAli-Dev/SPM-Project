import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
export declare class WalletsService {
    private walletRepository;
    constructor(walletRepository: Repository<Wallet>);
    findByUser(user_id: number, requesting_user_id: number): Promise<Wallet>;
    fund(user_id: number, amount: number, requesting_user_id: number): Promise<Wallet>;
}
