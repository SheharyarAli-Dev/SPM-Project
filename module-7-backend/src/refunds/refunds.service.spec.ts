import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefundsService } from './refunds.service';
import { Refund } from './refund.entity';

describe('RefundsService', () => {
  let service: RefundsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundsService,
        { provide: getRepositoryToken(Refund), useValue: {} },
      ],
    }).compile();

    service = module.get<RefundsService>(RefundsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
