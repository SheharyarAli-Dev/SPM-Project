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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./invoice.entity");
let InvoicesService = class InvoicesService {
    invoiceRepository;
    constructor(invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    findAll(user_id) {
        return this.invoiceRepository.find({
            where: [{ client_user_id: user_id }, { freelancer_user_id: user_id }],
            order: { generated_at: 'DESC' },
        });
    }
    async findOne(id) {
        const invoice = await this.invoiceRepository.findOne({ where: { id } });
        if (!invoice)
            throw new common_1.NotFoundException(`Invoice ${id} not found`);
        return invoice;
    }
    async create(body) {
        const platform_fee = body.platform_fee || body.gross_amount * 0.02;
        const tax_amount = body.tax_amount || 0;
        const net_amount = body.gross_amount - platform_fee - tax_amount;
        const invoice_number = `INV-${Date.now()}`;
        const invoice = this.invoiceRepository.create({
            ...body,
            platform_fee,
            tax_amount,
            net_amount,
            invoice_number,
        });
        return this.invoiceRepository.save(invoice);
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map