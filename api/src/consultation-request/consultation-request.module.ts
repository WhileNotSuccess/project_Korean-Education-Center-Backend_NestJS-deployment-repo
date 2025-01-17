import { Module } from '@nestjs/common';
import { ConsultationRequestService } from './consultation-request.service';
import { ConsultationRequestController } from './consultation-request.controller';

@Module({
  controllers: [ConsultationRequestController],
  providers: [ConsultationRequestService],
})
export class ConsultationRequestModule {}
