import { WalletsService } from './wallets.service';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    findByUser(userId: string, requestingUserId: string): Promise<import("./wallet.entity").Wallet>;
    fund(body: {
        user_id: number;
        amount: number;
    }, userId: string): Promise<import("./wallet.entity").Wallet>;
}
