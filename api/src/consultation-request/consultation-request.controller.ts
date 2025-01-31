import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsultationRequestService } from './consultation-request.service';
import { CreateConsultationRequestDto } from './dto/create-consultation-request.dto';
import { UpdateConsultationRequestDto } from './dto/update-consultation-request.dto';

@Controller('consultation-request')
export class ConsultationRequestController {
  constructor(
    private readonly consultationRequestService: ConsultationRequestService,
  ) {}
}
