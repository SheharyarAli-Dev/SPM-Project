export declare class Notification {
    id: number;
    transaction_id: number;
    withdrawal_id: number;
    refund_id: number;
    recipient_id: number;
    notification_type: string;
    title: string;
    message: string;
    channel: string;
    status: string;
    sent_at: Date;
    created_at: Date;
}
