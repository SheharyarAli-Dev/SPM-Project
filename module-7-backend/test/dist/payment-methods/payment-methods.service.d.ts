import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-method.entity';
export declare class PaymentMethodsService {
    private paymentMethodRepository;
    constructor(paymentMethodRepository: Repository<PaymentMethod>);
    findAll(user_id: number): Promise<PaymentMethod[]>;
    create(body: {
        user_id: number;
        method_type: string;
        provider_name: string;
        account_title: string;
        account_number_masked: string;
        iban_or_wallet_id: string;
        country_code: string;
    }): Promise<PaymentMethod>;
    setDefault(id: number, user_id: number): Promise<PaymentMethod>;
    remove(id: number): Promise<PaymentMethod>;
}
