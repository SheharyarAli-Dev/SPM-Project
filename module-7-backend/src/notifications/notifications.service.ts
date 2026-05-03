import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  findAll(recipient_id: number) {
    return this.notificationRepository.find({
      where: { recipient_id },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification)
      throw new NotFoundException(`Notification ${id} not found`);
    return notification;
  }

  async create(body: {
    recipient_id: number;
    notification_type: string;
    title: string;
    message: string;
    transaction_id?: number;
    withdrawal_id?: number;
    refund_id?: number;
    channel?: string;
  }) {
    const notification = this.notificationRepository.create(body);
    return this.notificationRepository.save(notification);
  }

  async markRead(id: number) {
    const notification = await this.findOne(id);
    notification.status = 'read';
    notification.sent_at = new Date();
    return this.notificationRepository.save(notification);
  }
}
