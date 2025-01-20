import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationFormService } from './application-form.service';

describe('ApplicationFormService', () => {
  let service: ApplicationFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationFormService],
    }).compile();

    service = module.get<ApplicationFormService>(ApplicationFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
