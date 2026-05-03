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
exports.CurrencyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const currency_rate_entity_1 = require("./currency-rate.entity");
let CurrencyService = class CurrencyService {
    currencyRateRepository;
    constructor(currencyRateRepository) {
        this.currencyRateRepository = currencyRateRepository;
    }
    findAll() {
        return this.currencyRateRepository.find({
            where: { is_active: true },
            order: { fetched_at: 'DESC' },
        });
    }
    async findRate(base, target) {
        const rate = await this.currencyRateRepository.findOne({
            where: { base_currency: base, target_currency: target, is_active: true },
            order: { fetched_at: 'DESC' },
        });
        if (!rate)
            throw new common_1.NotFoundException(`Rate for ${base} to ${target} not found`);
        return rate;
    }
    async create(body) {
        const rate = this.currencyRateRepository.create(body);
        return this.currencyRateRepository.save(rate);
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_rate_entity_1.CurrencyRate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CurrencyService);
//# sourceMappingURL=currency.service.js.map