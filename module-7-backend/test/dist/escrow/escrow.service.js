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
exports.EscrowService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const escrow_entity_1 = require("./escrow.entity");
let EscrowService = class EscrowService {
    escrowRepository;
    constructor(escrowRepository) {
        this.escrowRepository = escrowRepository;
    }
    findAll() {
        return this.escrowRepository.find();
    }
    async findOne(id) {
        const escrow = await this.escrowRepository.findOne({ where: { id } });
        if (!escrow)
            throw new common_1.NotFoundException(`Escrow ${id} not found`);
        return escrow;
    }
    async findByProject(project_id) {
        const escrow = await this.escrowRepository.findOne({
            where: { project_id },
        });
        if (!escrow)
            throw new common_1.NotFoundException(`Escrow for project ${project_id} not found`);
        return escrow;
    }
    async create(body) {
        const escrow = this.escrowRepository.create({
            ...body,
            escrow_status: 'pending',
        });
        return this.escrowRepository.save(escrow);
    }
    async fund(id, amount, requesting_user_id) {
        const escrow = await this.findOne(id);
        if (escrow.client_user_id !== requesting_user_id) {
            throw new common_1.ForbiddenException('Only the client can fund this escrow');
        }
        escrow.funded_amount = Number(escrow.funded_amount) + amount;
        escrow.escrow_status = 'active';
        escrow.funded_at = new Date();
        return this.escrowRepository.save(escrow);
    }
    async freeze(id, requesting_user_id) {
        const escrow = await this.findOne(id);
        if (escrow.client_user_id !== requesting_user_id) {
            throw new common_1.ForbiddenException('Only the client can freeze this escrow');
        }
        escrow.escrow_status = 'frozen';
        return this.escrowRepository.save(escrow);
    }
    async close(id, requesting_user_id) {
        const escrow = await this.findOne(id);
        if (escrow.client_user_id !== requesting_user_id) {
            throw new common_1.ForbiddenException('Only the client can close this escrow');
        }
        escrow.escrow_status = 'completed';
        escrow.closed_at = new Date();
        return this.escrowRepository.save(escrow);
    }
};
exports.EscrowService = EscrowService;
exports.EscrowService = EscrowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(escrow_entity_1.Escrow)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EscrowService);
//# sourceMappingURL=escrow.service.js.map