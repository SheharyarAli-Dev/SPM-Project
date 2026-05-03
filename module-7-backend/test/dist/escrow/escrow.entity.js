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
exports.Escrow = void 0;
const typeorm_1 = require("typeorm");
let Escrow = class Escrow {
    id;
    project_id;
    client_user_id;
    freelancer_user_id;
    currency_code;
    total_amount;
    funded_amount;
    released_amount;
    refunded_amount;
    escrow_status;
    funded_at;
    closed_at;
    created_at;
    updated_at;
};
exports.Escrow = Escrow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Escrow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Escrow.prototype, "project_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Escrow.prototype, "client_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Escrow.prototype, "freelancer_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Escrow.prototype, "currency_code", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4 }),
    __metadata("design:type", Number)
], Escrow.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Escrow.prototype, "funded_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Escrow.prototype, "released_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Escrow.prototype, "refunded_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Escrow.prototype, "escrow_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Escrow.prototype, "funded_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Escrow.prototype, "closed_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Escrow.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Escrow.prototype, "updated_at", void 0);
exports.Escrow = Escrow = __decorate([
    (0, typeorm_1.Entity)('escrow_accounts')
], Escrow);
//# sourceMappingURL=escrow.entity.js.map