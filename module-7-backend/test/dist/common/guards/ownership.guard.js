"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
let OwnershipGuard = class OwnershipGuard {
    canActivate(context) {
        const request = context
            .switchToHttp()
            .getRequest();
        const headerValue = request.headers['x-user-id'];
        const rawUserId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
        const requesting_user_id = Number.parseInt(rawUserId ?? '', 10);
        if (!Number.isFinite(requesting_user_id)) {
            throw new common_1.ForbiddenException('x-user-id header is required');
        }
        request.user_id = requesting_user_id;
        return true;
    }
};
exports.OwnershipGuard = OwnershipGuard;
exports.OwnershipGuard = OwnershipGuard = __decorate([
    (0, common_1.Injectable)()
], OwnershipGuard);
//# sourceMappingURL=ownership.guard.js.map