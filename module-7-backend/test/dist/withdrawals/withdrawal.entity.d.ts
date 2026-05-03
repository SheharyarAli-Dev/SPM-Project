export declare class Withdrawal {
    id: number;
    user_id: number;
    wallet_id: number;
    payment_method_id: number;
    transaction_id: number;
    amount: number;
    processing_fee: number;
    net_amount: number;
    currency_code: string;
    status: string;
    requested_at: Date;
    processed_at: Date;
    admin_note: string;
}
