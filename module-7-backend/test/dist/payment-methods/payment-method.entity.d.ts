export declare class PaymentMethod {
    id: number;
    user_id: number;
    method_type: string;
    provider_name: string;
    account_title: string;
    account_number_masked: string;
    iban_or_wallet_id: string;
    country_code: string;
    is_verified: boolean;
    is_default: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
