export declare class Transaction {
    id: number;
    wallet_id: number;
    escrow_id: number;
    invoice_id: number;
    sender_user_id: number;
    receiver_user_id: number;
    transaction_type: string;
    amount: number;
    currency_code: string;
    status: string;
    reference_no: string;
    description: string;
    created_at: Date;
    processed_at: Date;
}
