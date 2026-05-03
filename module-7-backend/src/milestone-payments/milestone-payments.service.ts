import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MilestonePayment } from './milestone-payment.entity';
import { Escrow } from '../escrow/escrow.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Notification } from '../notifications/notification.entity';

@Injectable()
export class MilestonePaymentsService {
  constructor(
    @InjectRepository(MilestonePayment)
    private milestonePaymentRepository: Repository<MilestonePayment>,
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

  findAll(escrow_id: number) {
    return this.milestonePaymentRepository.find({ where: { escrow_id } });
  }

  async findOne(id: number) {
    const payment = await this.milestonePaymentRepository.findOne({
      where: { id },
    });
    if (!payment)
      throw new NotFoundException(`Milestone payment ${id} not found`);
    return payment;
  }

  async create(body: {
    escrow_id: number;
    milestone_id: number;
    title: string;
    amount: number;
    due_date?: string | Date;
  }) {
    if (body.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const payment = this.milestonePaymentRepository.create(body);
    return this.milestonePaymentRepository.save(payment);
  }

  async approve(id: number) {
    const payment = await this.findOne(id);
    payment.approval_status = 'approved';
    payment.approved_at = new Date();
    return this.milestonePaymentRepository.save(payment);
  }

  async reject(id: number) {
    const payment = await this.findOne(id);
    payment.approval_status = 'rejected';
    return this.milestonePaymentRepository.save(payment);
  }

  async release(id: number) {
    const payment = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const escrow = await queryRunner.manager.findOne(Escrow, {
        where: { id: payment.escrow_id },
      });
      if (!escrow) {
        throw new NotFoundException(`Escrow ${payment.escrow_id} not found`);
      }

      const freelancerWallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: escrow.freelancer_user_id },
      });
      if (!freelancerWallet) {
        throw new NotFoundException(`Wallet for freelancer ${escrow.freelancer_user_id} not found`);
      }

      freelancerWallet.available_balance =
        Number(freelancerWallet.available_balance) + Number(payment.amount);
      await queryRunner.manager.save(Wallet, freelancerWallet);

      escrow.funded_amount = Number(escrow.funded_amount) - Number(payment.amount);
      escrow.released_amount = Number(escrow.released_amount) + Number(payment.amount);
      await queryRunner.manager.save(Escrow, escrow);

      payment.release_status = 'released';
      payment.released_at = new Date();
      await queryRunner.manager.save(MilestonePayment, payment);

      const transaction = queryRunner.manager.create(Transaction, {
        wallet_id: freelancerWallet.id,
        escrow_id: escrow.id,
        receiver_user_id: escrow.freelancer_user_id,
        sender_user_id: escrow.client_user_id,
        transaction_type: 'milestone_payment',
        amount: payment.amount,
        currency_code: escrow.currency_code,
        status: 'completed',
        description: `Milestone payment released: ${payment.title}`,
        processed_at: new Date(),
      });
      await queryRunner.manager.save(Transaction, transaction);

      const freelancerNotification = queryRunner.manager.create(Notification, {
        recipient_id: escrow.freelancer_user_id,
        notification_type: 'payment_received',
        title: 'Milestone Payment Released',
        message: `${payment.amount} ${escrow.currency_code} has been released for milestone: ${payment.title}`,
        channel: 'in_app',
        status: 'pending',
        transaction_id: transaction.id,
      });
      await queryRunner.manager.save(Notification, freelancerNotification);

      const clientNotification = queryRunner.manager.create(Notification, {
        recipient_id: escrow.client_user_id,
        notification_type: 'payment_sent',
        title: 'Payment Released to Freelancer',
        message: `You released ${payment.amount} ${escrow.currency_code} for milestone: ${payment.title}`,
        channel: 'in_app',
        status: 'pending',
        transaction_id: transaction.id,
      });
      await queryRunner.manager.save(Notification, clientNotification);

      await queryRunner.commitTransaction();
      return payment;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
