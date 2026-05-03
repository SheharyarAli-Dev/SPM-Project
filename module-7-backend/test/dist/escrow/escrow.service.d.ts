import { Repository } from 'typeorm';
import { Escrow } from './escrow.entity';
export declare class EscrowService {
    private escrowRepository;
    constructor(escrowRepository: Repository<Escrow>);
    findAll(): Promise<Escrow[]>;
    findOne(id: number): Promise<Escrow>;
    findByProject(project_id: number): Promise<Escrow>;
    create(body: {
        project_id: number;
        client_user_id: number;
        freelancer_user_id: number;
        currency_code: string;
        total_amount: number;
    }): Promise<Escrow>;
    fund(id: number, amount: number, requesting_user_id: number): Promise<Escrow>;
    freeze(id: number, requesting_user_id: number): Promise<Escrow>;
    close(id: number, requesting_user_id: number): Promise<Escrow>;
}
