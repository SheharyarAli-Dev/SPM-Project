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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const typeorm_1 = require("typeorm");
let Wallet = class Wallet {
    id;
    user_id;
    currency_code;
    available_balance;
    held_balance;
    reserved_balance;
    wallet_status;
    created_at;
    updated_at;
};
exports.Wallet = Wallet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Wallet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Wallet.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], Wallet.prototype, "currency_code", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Wallet.prototype, "available_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Wallet.prototype, "held_balance", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Wallet.prototype, "reserved_balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Wallet.prototype, "wallet_status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Wallet.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Wallet.prototype, "updated_at", void 0);
exports.Wallet = Wallet = __decorate([
    (0, typeorm_1.Entity)('wallets')
], Wallet);
//# sourceMappingURL=wallet.entity.js.map