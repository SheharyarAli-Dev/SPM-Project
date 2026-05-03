"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const withdrawal_entity_1 = require("./withdrawal.entity");
let WithdrawalsService = class WithdrawalsService {
    withdrawalRepository;
    constructor(withdrawalRepository) {
        this.withdrawalRepository = withdrawalRepository;
    }
    findAll() {
        return this.withdrawalRepository.find();
    }
    async findOne(id) {
        const withdrawal = await this.withdrawalRepository.findOne({
            where: { id },
        });
        if (!withdrawal)
            throw new common_1.NotFoundException(`Withdrawal ${id} not found`);
        return withdrawal;
    }
    async create(body, requesting_user_id) {
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
    async approve(id) {
        const withdrawal = await this.findOne(id);
        withdrawal.status = 'completed';
        withdrawal.processed_at = new Date();
        return this.withdrawalRepository.save(withdrawal);
    }
    async reject(id, admin_note) {
        const withdrawal = await this.findOne(id);
        withdrawal.status = 'rejected';
        withdrawal.admin_note = admin_note;
        withdrawal.processed_at = new Date();
        return this.withdrawalRepository.save(withdrawal);
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(withdrawal_entity_1.Withdrawal)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WithdrawalsService);
//# sourceMappingURL=withdrawals.service.js.map