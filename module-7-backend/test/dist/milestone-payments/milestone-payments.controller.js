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
exports.MilestonePaymentsController = void 0;
const common_1 = require("@nestjs/common");
const milestone_payments_service_1 = require("./milestone-payments.service");
const ownership_guard_1 = require("../common/guards/ownership.guard");
let MilestonePaymentsController = class MilestonePaymentsController {
    milestonePaymentsService;
    constructor(milestonePaymentsService) {
        this.milestonePaymentsService = milestonePaymentsService;
    }
    findAll(escrow_id) {
        return this.milestonePaymentsService.findAll(+escrow_id);
    }
    findOne(id) {
        return this.milestonePaymentsService.findOne(+id);
    }
    create(body) {
        return this.milestonePaymentsService.create(body);
    }
    approve(id) {
        return this.milestonePaymentsService.approve(+id);
    }
    reject(id) {
        return this.milestonePaymentsService.reject(+id);
    }
    release(id) {
        return this.milestonePaymentsService.release(+id);
    }
};
exports.MilestonePaymentsController = MilestonePaymentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('escrow_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonePaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonePaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(ownership_guard_1.OwnershipGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MilestonePaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.UseGuards)(ownership_guard_1.OwnershipGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonePaymentsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, common_1.UseGuards)(ownership_guard_1.OwnershipGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonePaymentsController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/release'),
    (0, common_1.UseGuards)(ownership_guard_1.OwnershipGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonePaymentsController.prototype, "release", null);
exports.MilestonePaymentsController = MilestonePaymentsController = __decorate([
    (0, common_1.Controller)('milestone-payments'),
    __metadata("design:paramtypes", [milestone_payments_service_1.MilestonePaymentsService])
], MilestonePaymentsController);
//# sourceMappingURL=milestone-payments.controller.js.map