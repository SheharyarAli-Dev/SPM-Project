import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
export declare class NotificationsService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    findAll(recipient_id: number): Promise<Notification[]>;
    findOne(id: number): Promise<Notification>;
    create(body: {
        recipient_id: number;
        notification_type: string;
        title: string;
        message: string;
        transaction_id?: number;
        withdrawal_id?: number;
        refund_id?: number;
        channel?: string;
    }): Promise<Notification>;
    markRead(id: number): Promise<Notification>;
}
