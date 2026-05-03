export declare class Refund {
    id: number;
    transaction_id: number;
    escrow_id: number;
    milestone_payment_id: number;
    requested_by: number;
    approved_by_admin: number;
    reason: string;
    refund_amount: number;
    status: string;
    created_at: Date;
    resolved_at: Date;
}
