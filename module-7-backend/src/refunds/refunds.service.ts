import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Refund } from './refund.entity';
import { Escrow } from '../escrow/escrow.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Notification } from '../notifications/notification.entity';

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(Refund)
    private refundRepository: Repository<Refund>,
    @InjectRepository(Escrow)
    private escrowRepository: Repository<Escrow>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private dataSource: DataSource,
  ) { }

  findAll(user_id?: number) {
    const where = user_id ? { requested_by: user_id } : {};
    return this.refundRepository.find({ where, order: { created_at: 'DESC' } });
  }

  async findOne(id: number) {
    const refund = await this.refundRepository.findOne({ where: { id } });
    if (!refund) throw new NotFoundException(`Refund ${id} not found`);
    return refund;
  }

  async create(
    body: {
      transaction_id: number;
      escrow_id: number;
      milestone_payment_id?: number;
      requested_by: number;
      reason: string;
      refund_amount: number;
    },
    requesting_user_id: number,
  ) {
    if (body.requested_by !== requesting_user_id) {
      throw new ForbiddenException('You can only request refunds for yourself');
    }
    const refund = this.refundRepository.create(body);
    return this.refundRepository.save(refund);
  }

  async approve(id: number, admin_id: number) {
    const refund = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: refund.requested_by },
      });
      if (!wallet) {
        throw new NotFoundException(`Wallet for user ${refund.requested_by} not found`);
      }

      wallet.available_balance = Number(wallet.available_balance) + Number(refund.refund_amount);
      await queryRunner.manager.save(Wallet, wallet);

      const escrow = await queryRunner.manager.findOne(Escrow, {
        where: { id: refund.escrow_id },
      });
      if (!escrow) {
        throw new NotFoundException(`Escrow ${refund.escrow_id} not found`);
      }

      escrow.funded_amount = Number(escrow.funded_amount) - Number(refund.refund_amount);
      escrow.refunded_amount = Number(escrow.refunded_amount) + Number(refund.refund_amount);
      if (Number(escrow.funded_amount) <= 0) {
        escrow.escrow_status = 'refunded';
      }
      await queryRunner.manager.save(Escrow, escrow);

      refund.status = 'approved';
      refund.approved_by_admin = admin_id;
      refund.resolved_at = new Date();
      await queryRunner.manager.save(Refund, refund);

      const transaction = queryRunner.manager.create(Transaction, {
        wallet_id: wallet.id,
        escrow_id: refund.escrow_id,
        transaction_type: 'refund',
        amount: refund.refund_amount,
        currency_code: escrow.currency_code,
        status: 'completed',
        receiver_user_id: refund.requested_by,
        description: `Refund approved for: ${refund.reason}`,
        processed_at: new Date(),
      });
      await queryRunner.manager.save(Transaction, transaction);

      const notification = queryRunner.manager.create(Notification, {
        recipient_id: refund.requested_by,
        refund_id: refund.id,
        transaction_id: transaction.id,
        notification_type: 'refund_approved',
        title: 'Refund Approved',
        message: `Your refund of ${refund.refund_amount} has been approved and credited to your wallet.`,
        channel: 'in_app',
        status: 'pending',
      });
      await queryRunner.manager.save(Notification, notification);

      await queryRunner.commitTransaction();
      return refund;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async reject(id: number, admin_id: number) {
    const refund = await this.findOne(id);
    refund.status = 'rejected';
    refund.approved_by_admin = admin_id;
    refund.resolved_at = new Date();
    return this.refundRepository.save(refund);
  }
}
