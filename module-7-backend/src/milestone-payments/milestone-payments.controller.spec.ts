import { Test, TestingModule } from '@nestjs/testing';
import { MilestonePaymentsController } from './milestone-payments.controller';
import { MilestonePaymentsService } from './milestone-payments.service';

describe('MilestonePaymentsController', () => {
  let controller: MilestonePaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilestonePaymentsController],
      providers: [{ provide: MilestonePaymentsService, useValue: {} }],
    }).compile();

    controller = module.get<MilestonePaymentsController>(
      MilestonePaymentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
