import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
export declare class TransactionsService {
    private transactionRepository;
    constructor(transactionRepository: Repository<Transaction>);
    findAll(wallet_id: number): Promise<Transaction[]>;
    findOne(id: number): Promise<Transaction>;
}
