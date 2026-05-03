export declare class CurrencyRate {
    id: number;
    base_currency: string;
    target_currency: string;
    exchange_rate: number;
    source_api: string;
    fetched_at: Date;
    is_active: boolean;
}
