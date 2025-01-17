import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationRequestController } from './consultation-request.controller';
import { ConsultationRequestService } from './consultation-request.service';

describe('ConsultationRequestController', () => {
  let controller: ConsultationRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultationRequestController],
      providers: [ConsultationRequestService],
    }).compile();

    controller = module.get<ConsultationRequestController>(ConsultationRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
