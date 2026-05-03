"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const withdrawals_module_1 = require("./withdrawals/withdrawals.module");
const wallets_module_1 = require("./wallets/wallets.module");
const payment_methods_module_1 = require("./payment-methods/payment-methods.module");
const transactions_module_1 = require("./transactions/transactions.module");
const escrow_module_1 = require("./escrow/escrow.module");
const milestone_payments_module_1 = require("./milestone-payments/milestone-payments.module");
const invoices_module_1 = require("./invoices/invoices.module");
const refunds_module_1 = require("./refunds/refunds.module");
const currency_module_1 = require("./currency/currency.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: +configService.get('DB_PORT', '5432'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    autoLoadEntities: true,
                    synchronize: false,
                }),
                inject: [config_1.ConfigService],
            }),
            withdrawals_module_1.WithdrawalsModule,
            wallets_module_1.WalletsModule,
            payment_methods_module_1.PaymentMethodsModule,
            transactions_module_1.TransactionsModule,
            escrow_module_1.EscrowModule,
            milestone_payments_module_1.MilestonePaymentsModule,
            invoices_module_1.InvoicesModule,
            refunds_module_1.RefundsModule,
            currency_module_1.CurrencyModule,
            notifications_module_1.NotificationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map