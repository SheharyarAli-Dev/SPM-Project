import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(recipient_id: string): Promise<import("./notification.entity").Notification[]>;
    findOne(id: string): Promise<import("./notification.entity").Notification>;
    create(body: {
        recipient_id: number;
        notification_type: string;
        title: string;
        message: string;
        transaction_id?: number;
        withdrawal_id?: number;
        refund_id?: number;
        channel?: string;
    }): Promise<import("./notification.entity").Notification>;
    markRead(id: string): Promise<import("./notification.entity").Notification>;
}
