import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MilestonePaymentsService } from './milestone-payments.service';
import { MilestonePayment } from './milestone-payment.entity';

describe('MilestonePaymentsService', () => {
  let service: MilestonePaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MilestonePaymentsService,
        { provide: getRepositoryToken(MilestonePayment), useValue: {} },
      ],
    }).compile();

    service = module.get<MilestonePaymentsService>(MilestonePaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
