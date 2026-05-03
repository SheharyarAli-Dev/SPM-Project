import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(wallet_id: string): Promise<import("./transaction.entity").Transaction[]>;
    findOne(id: string): Promise<import("./transaction.entity").Transaction>;
}
