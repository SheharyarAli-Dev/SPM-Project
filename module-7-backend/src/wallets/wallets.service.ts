import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletsService {
  private static readonly ROLE_OFFSET = 100000;

  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) { }

  /**
   * TEMPORARY: Until the wallets table has a user_role column,
   * freelancer wallets use userId + 100000 offset to separate
   * them from client wallets. See TEMP_WORKAROUND.md.
   */
  getEffectiveUserId(userId: number, role: string): number {
    if (role === 'freelancer') return userId + WalletsService.ROLE_OFFSET;
    return userId;
  }

  /**
   * Reverse lookup: given an effective user_id stored in the DB,
   * return the original userId and role.
   */
  parseEffectiveUserId(effectiveUserId: number): { userId: number; role: string } {
    if (effectiveUserId > WalletsService.ROLE_OFFSET) {
      return { userId: effectiveUserId - WalletsService.ROLE_OFFSET, role: 'freelancer' };
    }
    return { userId: effectiveUserId, role: 'client' };
  }

  async findWalletByUserId(user_id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { user_id } });
    if (!wallet)
      throw new NotFoundException(`Wallet for user ${user_id} not found`);
    return wallet;
  }

  async findByUserIdAndRole(userId: number, role: string): Promise<Wallet> {
    const effectiveId = this.getEffectiveUserId(userId, role);
    let wallet = await this.walletRepository.findOne({ where: { user_id: effectiveId } });
    if (wallet) return wallet;
    if (role === 'client' || role === 'admin') {
      return this.createWallet(userId, role);
    }
    throw new NotFoundException(`Wallet for user ${userId} (role: ${role}) not found`);
  }

  async findByUser(user_id: number, requesting_user_id: number, role?: string) {
    if (user_id !== requesting_user_id) {
      throw new ForbiddenException('You can only view your own wallet');
    }
    if (role) {
      return this.findByUserIdAndRole(user_id, role);
    }
    const wallet = await this.walletRepository.findOne({ where: { user_id } });
    if (!wallet)
      throw new NotFoundException(`Wallet for user ${user_id} not found`);
    return wallet;
  }

  async createWallet(userId: number, role: string): Promise<Wallet> {
    const effectiveId = this.getEffectiveUserId(userId, role);
    const existing = await this.walletRepository.findOne({
      where: { user_id: effectiveId },
    });
    if (existing) return existing;

    const wallet = this.walletRepository.create({
      user_id: effectiveId,
      available_balance: 0,
      held_balance: 0,
      reserved_balance: 0,
      currency_code: 'USD',
      wallet_status: 'active',
    });
    return this.walletRepository.save(wallet);
  }

  async fund(user_id: number, amount: number, requesting_user_id: number, role?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    if (user_id !== requesting_user_id) {
      throw new ForbiddenException('You can only fund your own wallet');
    }

    let wallet: Wallet | null;
    if (role) {
      const effectiveId = this.getEffectiveUserId(user_id, role);
      wallet = await this.walletRepository.findOne({ where: { user_id: effectiveId } });
      if (!wallet) {
        wallet = await this.createWallet(user_id, role);
      }
    } else {
      wallet = await this.walletRepository.findOne({ where: { user_id } });
      if (!wallet)
        throw new NotFoundException(`Wallet for user ${user_id} not found`);
    }

    wallet.available_balance = Number(wallet.available_balance) + amount;
    return this.walletRepository.save(wallet);
  }
}
