import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationRequestService } from './consultation-request.service';

describe('ConsultationRequestService', () => {
  let service: ConsultationRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultationRequestService],
    }).compile();

    service = module.get<ConsultationRequestService>(ConsultationRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
