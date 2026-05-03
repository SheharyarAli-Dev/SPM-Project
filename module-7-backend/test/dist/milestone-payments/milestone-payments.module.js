"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestonePaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const milestone_payments_controller_1 = require("./milestone-payments.controller");
const milestone_payments_service_1 = require("./milestone-payments.service");
const milestone_payment_entity_1 = require("./milestone-payment.entity");
let MilestonePaymentsModule = class MilestonePaymentsModule {
};
exports.MilestonePaymentsModule = MilestonePaymentsModule;
exports.MilestonePaymentsModule = MilestonePaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([milestone_payment_entity_1.MilestonePayment])],
        controllers: [milestone_payments_controller_1.MilestonePaymentsController],
        providers: [milestone_payments_service_1.MilestonePaymentsService],
    })
], MilestonePaymentsModule);
//# sourceMappingURL=milestone-payments.module.js.map