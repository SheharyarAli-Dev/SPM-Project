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
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./wallet.entity");
let WalletsService = class WalletsService {
    walletRepository;
    constructor(walletRepository) {
        this.walletRepository = walletRepository;
    }
    async findByUser(user_id, requesting_user_id) {
        if (user_id !== requesting_user_id) {
            throw new common_1.ForbiddenException('You can only view your own wallet');
        }
        const wallet = await this.walletRepository.findOne({ where: { user_id } });
        if (!wallet)
            throw new common_1.NotFoundException(`Wallet for user ${user_id} not found`);
        return wallet;
    }
    async fund(user_id, amount, requesting_user_id) {
        if (user_id !== requesting_user_id) {
            throw new common_1.ForbiddenException('You can only fund your own wallet');
        }
        const wallet = await this.walletRepository.findOne({ where: { user_id } });
        if (!wallet)
            throw new common_1.NotFoundException(`Wallet for user ${user_id} not found`);
        wallet.available_balance = Number(wallet.available_balance) + amount;
        return this.walletRepository.save(wallet);
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map