import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';
import { Refund } from './refund.entity';
import { EscrowModule } from '../escrow/escrow.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Refund]),
    EscrowModule,
    WalletsModule,
    TransactionsModule,
    NotificationsModule,
  ],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule { }
