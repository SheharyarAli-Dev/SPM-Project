export declare class MilestonePayment {
    id: number;
    escrow_id: number;
    milestone_id: number;
    title: string;
    amount: number;
    due_date: Date;
    approval_status: string;
    release_status: string;
    approved_at: Date;
    released_at: Date;
    created_at: Date;
    updated_at: Date;
}
