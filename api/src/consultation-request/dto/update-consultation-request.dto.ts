import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultationRequestDto } from './create-consultation-request.dto';

export class UpdateConsultationRequestDto extends PartialType(CreateConsultationRequestDto) {}
