import { Module } from '@nestjs/common';
import { ApplicationFormService } from './application-form.service';
import { ApplicationFormController } from './application-form.controller';
import { ApplicationAttachmentsModule } from 'src/application-attachments/application-attachments.module';

@Module({
  imports:[ApplicationAttachmentsModule],
  controllers: [ApplicationFormController],
  providers: [ApplicationFormService],
})
export class ApplicationFormModule {}
