import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Withdrawal } from './withdrawal.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Notification } from '../notifications/notification.entity';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private dataSource: DataSource,
  ) { }

  findAll(user_id?: number) {
    const where = user_id ? { user_id } : {};
    return this.withdrawalRepository.find({ where, order: { requested_at: 'DESC' } });
  }

  async findOne(id: number) {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });
    if (!withdrawal) throw new NotFoundException(`Withdrawal ${id} not found`);
    return withdrawal;
  }

  async create(
    body: {
      amount: number;
      payment_method_id: number;
      wallet_id: number;
      currency_code?: string;
    },
    requesting_user_id: number,
  ) {
    if (body.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const fee = body.amount * 0.02;
    const net = body.amount - fee;
    const withdrawal = this.withdrawalRepository.create({
      user_id: requesting_user_id,
      wallet_id: body.wallet_id,
      payment_method_id: body.payment_method_id,
      amount: body.amount,
      processing_fee: fee,
      net_amount: net,
      currency_code: body.currency_code || 'USD',
      status: 'pending',
    });
    return this.withdrawalRepository.save(withdrawal);
  }

  async approve(id: number) {
    const withdrawal = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: withdrawal.user_id },
      });
      if (!wallet) {
        throw new NotFoundException(`Wallet for user ${withdrawal.user_id} not found`);
      }
      if (Number(wallet.available_balance) < Number(withdrawal.amount)) {
        throw new BadRequestException('Insufficient balance for withdrawal');
      }

      wallet.available_balance = Number(wallet.available_balance) - Number(withdrawal.amount);
      await queryRunner.manager.save(Wallet, wallet);

      withdrawal.status = 'completed';
      withdrawal.processed_at = new Date();
      await queryRunner.manager.save(Withdrawal, withdrawal);

      const transaction = queryRunner.manager.create(Transaction, {
        wallet_id: wallet.id,
        transaction_type: 'withdrawal',
        amount: withdrawal.amount,
        currency_code: withdrawal.currency_code,
        status: 'completed',
        sender_user_id: withdrawal.user_id,
        description: `Withdrawal to payment method #${withdrawal.payment_method_id}`,
        processed_at: new Date(),
      });
      await queryRunner.manager.save(Transaction, transaction);

      withdrawal.transaction_id = transaction.id;
      await queryRunner.manager.save(Withdrawal, withdrawal);

      const notification = queryRunner.manager.create(Notification, {
        recipient_id: withdrawal.user_id,
        withdrawal_id: withdrawal.id,
        transaction_id: transaction.id,
        notification_type: 'withdrawal_approved',
        title: 'Withdrawal Approved',
        message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.currency_code} has been approved and processed.`,
        channel: 'in_app',
        status: 'pending',
      });
      await queryRunner.manager.save(Notification, notification);

      await queryRunner.commitTransaction();
      return withdrawal;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async reject(id: number, admin_note: string) {
    const withdrawal = await this.findOne(id);
    withdrawal.status = 'rejected';
    withdrawal.admin_note = admin_note;
    withdrawal.processed_at = new Date();
    return this.withdrawalRepository.save(withdrawal);
  }
}
