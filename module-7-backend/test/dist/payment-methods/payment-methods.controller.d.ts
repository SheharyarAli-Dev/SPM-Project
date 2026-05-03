import { PaymentMethodsService } from './payment-methods.service';
export declare class PaymentMethodsController {
    private readonly paymentMethodsService;
    constructor(paymentMethodsService: PaymentMethodsService);
    findAll(user_id: string): Promise<import("./payment-method.entity").PaymentMethod[]>;
    create(body: {
        user_id: number;
        method_type: string;
        provider_name: string;
        account_title: string;
        account_number_masked: string;
        iban_or_wallet_id: string;
        country_code: string;
    }): Promise<import("./payment-method.entity").PaymentMethod>;
    setDefault(id: string, body: {
        user_id: number;
    }): Promise<import("./payment-method.entity").PaymentMethod>;
    remove(id: string): Promise<import("./payment-method.entity").PaymentMethod>;
}
