import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationFormController } from './application-form.controller';
import { ApplicationFormService } from './application-form.service';

describe('ApplicationFormController', () => {
  let controller: ApplicationFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationFormController],
      providers: [ApplicationFormService],
    }).compile();

    controller = module.get<ApplicationFormController>(ApplicationFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
