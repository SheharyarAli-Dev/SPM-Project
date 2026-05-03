import { Repository } from 'typeorm';
import { CurrencyRate } from './currency-rate.entity';
export declare class CurrencyService {
    private currencyRateRepository;
    constructor(currencyRateRepository: Repository<CurrencyRate>);
    findAll(): Promise<CurrencyRate[]>;
    findRate(base: string, target: string): Promise<CurrencyRate>;
    create(body: {
        base_currency: string;
        target_currency: string;
        exchange_rate: number;
        source_api: string;
    }): Promise<CurrencyRate>;
}
