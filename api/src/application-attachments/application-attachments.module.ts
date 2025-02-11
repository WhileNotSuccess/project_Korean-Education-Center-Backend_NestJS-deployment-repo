import { Module } from '@nestjs/common';
import { ApplicationAttachmentsService } from './application-attachments.service';
import { ApplicationAttachmentsController } from './application-attachments.controller';

@Module({
  exports:[ApplicationAttachmentsService],
  controllers: [ApplicationAttachmentsController],
  providers: [ApplicationAttachmentsService],
})
export class ApplicationAttachmentsModule {}
