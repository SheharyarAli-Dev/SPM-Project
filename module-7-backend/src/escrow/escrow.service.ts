import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Escrow } from './escrow.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Notification } from '../notifications/notification.entity';

@Injectable()
export class EscrowService {
  constructor(
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

  async findAll(pagination?: { page?: number; limit?: number }) {
    if (pagination?.page || pagination?.limit) {
      const page = pagination.page || 1;
      const limit = pagination.limit || 20;
      const skip = (page - 1) * limit;
      const [data, total] = await this.escrowRepository.findAndCount({
        skip,
        take: limit,
        order: { id: 'DESC' },
      });
      return { data, total, page, limit };
    }
    return this.escrowRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const escrow = await this.escrowRepository.findOne({ where: { id } });
    if (!escrow) throw new NotFoundException(`Escrow ${id} not found`);
    return escrow;
  }

  async findByProject(project_id: number) {
    const escrow = await this.escrowRepository.findOne({
      where: { project_id },
    });
    if (!escrow)
      throw new NotFoundException(`Escrow for project ${project_id} not found`);
    return escrow;
  }

  async create(body: {
    project_id: number;
    client_user_id: number;
    freelancer_user_id: number;
    currency_code: string;
    total_amount: number;
  }) {
    const escrow = this.escrowRepository.create({
      ...body,
      escrow_status: 'pending',
    });
    return this.escrowRepository.save(escrow);
  }

  async fund(id: number, amount: number, requesting_user_id: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const escrow = await this.findOne(id);
    if (escrow.client_user_id !== requesting_user_id) {
      throw new ForbiddenException('Only the client can fund this escrow');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: escrow.client_user_id },
      });
      if (!wallet) {
        throw new NotFoundException(`Wallet for user ${escrow.client_user_id} not found`);
      }
      if (Number(wallet.available_balance) < amount) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      wallet.available_balance = Number(wallet.available_balance) - amount;
      await queryRunner.manager.save(Wallet, wallet);

      escrow.funded_amount = Number(escrow.funded_amount) + amount;
      escrow.escrow_status = 'active';
      escrow.funded_at = new Date();
      await queryRunner.manager.save(Escrow, escrow);

      const transaction = queryRunner.manager.create(Transaction, {
        wallet_id: wallet.id,
        escrow_id: escrow.id,
        sender_user_id: escrow.client_user_id,
        transaction_type: 'escrow_deposit',
        amount: amount,
        currency_code: escrow.currency_code,
        status: 'completed',
        description: `Escrow deposit for escrow #${escrow.id}`,
        processed_at: new Date(),
      });
      await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.commitTransaction();
      return escrow;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async freeze(id: number, requesting_user_id: number) {
    const escrow = await this.findOne(id);
    if (escrow.client_user_id !== requesting_user_id) {
      throw new ForbiddenException('Only the client can freeze this escrow');
    }
    escrow.escrow_status = 'frozen';
    return this.escrowRepository.save(escrow);
  }

  async close(id: number, requesting_user_id: number) {
    const escrow = await this.findOne(id);
    if (escrow.client_user_id !== requesting_user_id) {
      throw new ForbiddenException('Only the client can close this escrow');
    }
    escrow.escrow_status = 'completed';
    escrow.closed_at = new Date();
    return this.escrowRepository.save(escrow);
  }
}
