import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { WalletsModule } from './wallets/wallets.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { TransactionsModule } from './transactions/transactions.module';
import { EscrowModule } from './escrow/escrow.module';
import { MilestonePaymentsModule } from './milestone-payments/milestone-payments.module';
import { InvoicesModule } from './invoices/invoices.module';
import { RefundsModule } from './refunds/refunds.module';
import { CurrencyModule } from './currency/currency.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT', '5432'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    WithdrawalsModule,
    WalletsModule,
    PaymentMethodsModule,
    TransactionsModule,
    EscrowModule,
    MilestonePaymentsModule,
    InvoicesModule,
    RefundsModule,
    CurrencyModule,
    NotificationsModule,
    UsersModule,
  ],
})
export class AppModule { }
