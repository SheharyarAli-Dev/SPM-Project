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
exports.RefundsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const refund_entity_1 = require("./refund.entity");
let RefundsService = class RefundsService {
    refundRepository;
    constructor(refundRepository) {
        this.refundRepository = refundRepository;
    }
    findAll() {
        return this.refundRepository.find({ order: { created_at: 'DESC' } });
    }
    async findOne(id) {
        const refund = await this.refundRepository.findOne({ where: { id } });
        if (!refund)
            throw new common_1.NotFoundException(`Refund ${id} not found`);
        return refund;
    }
    async create(body, requesting_user_id) {
        if (body.requested_by !== requesting_user_id) {
            throw new common_1.ForbiddenException('You can only request refunds for yourself');
        }
        const refund = this.refundRepository.create(body);
        return this.refundRepository.save(refund);
    }
    async approve(id, admin_id) {
        const refund = await this.findOne(id);
        refund.status = 'approved';
        refund.approved_by_admin = admin_id;
        refund.resolved_at = new Date();
        return this.refundRepository.save(refund);
    }
    async reject(id, admin_id) {
        const refund = await this.findOne(id);
        refund.status = 'rejected';
        refund.approved_by_admin = admin_id;
        refund.resolved_at = new Date();
        return this.refundRepository.save(refund);
    }
};
exports.RefundsService = RefundsService;
exports.RefundsService = RefundsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refund_entity_1.Refund)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RefundsService);
//# sourceMappingURL=refunds.service.js.map