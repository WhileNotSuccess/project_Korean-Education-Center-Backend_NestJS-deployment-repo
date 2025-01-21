import { Injectable } from '@nestjs/common';
import { CreateConsultationRequestDto } from './dto/create-consultation-request.dto';
import { UpdateConsultationRequestDto } from './dto/update-consultation-request.dto';

@Injectable()
export class ConsultationRequestService {
  create(createConsultationRequestDto: CreateConsultationRequestDto) {
    return 'This action adds a new consultationRequest';
  }

  findAll() {
    return `This action returns all consultationRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consultationRequest`;
  }

  update(id: number, updateConsultationRequestDto: UpdateConsultationRequestDto) {
    return `This action updates a #${id} consultationRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} consultationRequest`;
  }
}
