export declare class Invoice {
    id: number;
    invoice_number: string;
    milestone_payment_id: number;
    project_id: number;
    client_user_id: number;
    freelancer_user_id: number;
    gross_amount: number;
    platform_fee: number;
    tax_amount: number;
    net_amount: number;
    currency_code: string;
    invoice_pdf_url: string;
    generated_at: Date;
}
