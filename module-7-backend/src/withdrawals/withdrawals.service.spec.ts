import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WithdrawalsService } from './withdrawals.service';
import { Withdrawal } from './withdrawal.entity';

describe('WithdrawalsService', () => {
  let service: WithdrawalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawalsService,
        { provide: getRepositoryToken(Withdrawal), useValue: {} },
      ],
    }).compile();

    service = module.get<WithdrawalsService>(WithdrawalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
