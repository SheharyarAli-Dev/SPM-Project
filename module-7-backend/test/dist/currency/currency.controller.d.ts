import { CurrencyService } from './currency.service';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    findAll(): Promise<import("./currency-rate.entity").CurrencyRate[]>;
    findRate(base: string, target: string): Promise<import("./currency-rate.entity").CurrencyRate>;
    create(body: {
        base_currency: string;
        target_currency: string;
        exchange_rate: number;
        source_api: string;
    }): Promise<import("./currency-rate.entity").CurrencyRate>;
}
