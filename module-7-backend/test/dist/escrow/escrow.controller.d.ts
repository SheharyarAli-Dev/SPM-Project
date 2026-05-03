import { EscrowService } from './escrow.service';
export declare class EscrowController {
    private readonly escrowService;
    constructor(escrowService: EscrowService);
    findAll(): Promise<import("./escrow.entity").Escrow[]>;
    findOne(id: string): Promise<import("./escrow.entity").Escrow>;
    findByProject(projectId: string): Promise<import("./escrow.entity").Escrow>;
    create(body: {
        project_id: number;
        client_user_id: number;
        freelancer_user_id: number;
        currency_code: string;
        total_amount: number;
    }): Promise<import("./escrow.entity").Escrow>;
    fund(id: string, body: {
        amount: number;
    }, userId: string): Promise<import("./escrow.entity").Escrow>;
    freeze(id: string, userId: string): Promise<import("./escrow.entity").Escrow>;
    close(id: string, userId: string): Promise<import("./escrow.entity").Escrow>;
}
