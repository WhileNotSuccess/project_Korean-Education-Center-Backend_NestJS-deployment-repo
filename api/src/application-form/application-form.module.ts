import { Module } from '@nestjs/common';
import { ApplicationFormService } from './application-form.service';
import { ApplicationFormController } from './application-form.controller';

@Module({
  controllers: [ApplicationFormController],
  providers: [ApplicationFormService],
})
export class ApplicationFormModule {}
