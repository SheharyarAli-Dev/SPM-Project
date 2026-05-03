export declare class Escrow {
    id: number;
    project_id: number;
    client_user_id: number;
    freelancer_user_id: number;
    currency_code: string;
    total_amount: number;
    funded_amount: number;
    released_amount: number;
    refunded_amount: number;
    escrow_status: string;
    funded_at: Date;
    closed_at: Date;
    created_at: Date;
    updated_at: Date;
}
