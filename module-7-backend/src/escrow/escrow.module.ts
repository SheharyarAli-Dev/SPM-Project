import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';
import { Escrow } from './escrow.entity';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Escrow]),
    WalletsModule,
    TransactionsModule,
    NotificationsModule,
  ],
  controllers: [EscrowController],
  providers: [EscrowService],
  exports: [EscrowService, TypeOrmModule],
})
export class EscrowModule { }
