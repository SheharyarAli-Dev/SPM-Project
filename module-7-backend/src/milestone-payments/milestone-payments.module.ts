import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestonePaymentsController } from './milestone-payments.controller';
import { MilestonePaymentsService } from './milestone-payments.service';
import { MilestonePayment } from './milestone-payment.entity';
import { EscrowModule } from '../escrow/escrow.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MilestonePayment]),
    EscrowModule,
    WalletsModule,
    TransactionsModule,
    NotificationsModule,
  ],
  controllers: [MilestonePaymentsController],
  providers: [MilestonePaymentsService],
})
export class MilestonePaymentsModule { }
