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
exports.PaymentMethodsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_method_entity_1 = require("./payment-method.entity");
let PaymentMethodsService = class PaymentMethodsService {
    paymentMethodRepository;
    constructor(paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }
    findAll(user_id) {
        return this.paymentMethodRepository.find({
            where: { user_id, deleted_at: (0, typeorm_2.IsNull)() },
        });
    }
    async create(body) {
        const method = this.paymentMethodRepository.create(body);
        return this.paymentMethodRepository.save(method);
    }
    async setDefault(id, user_id) {
        await this.paymentMethodRepository.update({ user_id }, { is_default: false });
        const method = await this.paymentMethodRepository.findOne({
            where: { id },
        });
        if (!method)
            throw new common_1.NotFoundException(`Payment method ${id} not found`);
        method.is_default = true;
        return this.paymentMethodRepository.save(method);
    }
    async remove(id) {
        const method = await this.paymentMethodRepository.findOne({
            where: { id },
        });
        if (!method)
            throw new common_1.NotFoundException(`Payment method ${id} not found`);
        method.deleted_at = new Date();
        return this.paymentMethodRepository.save(method);
    }
};
exports.PaymentMethodsService = PaymentMethodsService;
exports.PaymentMethodsService = PaymentMethodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_method_entity_1.PaymentMethod)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentMethodsService);
//# sourceMappingURL=payment-methods.service.js.map