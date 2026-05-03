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
exports.MilestonePayment = void 0;
const typeorm_1 = require("typeorm");
let MilestonePayment = class MilestonePayment {
    id;
    escrow_id;
    milestone_id;
    title;
    amount;
    due_date;
    approval_status;
    release_status;
    approved_at;
    released_at;
    created_at;
    updated_at;
};
exports.MilestonePayment = MilestonePayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MilestonePayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MilestonePayment.prototype, "escrow_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MilestonePayment.prototype, "milestone_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MilestonePayment.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4 }),
    __metadata("design:type", Number)
], MilestonePayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MilestonePayment.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], MilestonePayment.prototype, "approval_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'not_released' }),
    __metadata("design:type", String)
], MilestonePayment.prototype, "release_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MilestonePayment.prototype, "approved_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MilestonePayment.prototype, "released_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MilestonePayment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MilestonePayment.prototype, "updated_at", void 0);
exports.MilestonePayment = MilestonePayment = __decorate([
    (0, typeorm_1.Entity)('milestone_payments')
], MilestonePayment);
//# sourceMappingURL=milestone-payment.entity.js.map