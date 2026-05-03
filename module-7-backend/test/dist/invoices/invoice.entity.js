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
exports.Invoice = void 0;
const typeorm_1 = require("typeorm");
let Invoice = class Invoice {
    id;
    invoice_number;
    milestone_payment_id;
    project_id;
    client_user_id;
    freelancer_user_id;
    gross_amount;
    platform_fee;
    tax_amount;
    net_amount;
    currency_code;
    invoice_pdf_url;
    generated_at;
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Invoice.prototype, "invoice_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Invoice.prototype, "milestone_payment_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Invoice.prototype, "project_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Invoice.prototype, "client_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Invoice.prototype, "freelancer_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4 }),
    __metadata("design:type", Number)
], Invoice.prototype, "gross_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "platform_fee", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "tax_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 4 }),
    __metadata("design:type", Number)
], Invoice.prototype, "net_amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Invoice.prototype, "currency_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "invoice_pdf_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Invoice.prototype, "generated_at", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)('invoices')
], Invoice);
//# sourceMappingURL=invoice.entity.js.map