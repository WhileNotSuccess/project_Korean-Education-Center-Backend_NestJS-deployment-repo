import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultationRequestService } from './consultation-request.service';
import { CreateConsultationRequestDto } from './dto/create-consultation-request.dto';
import { UpdateConsultationRequestDto } from './dto/update-consultation-request.dto';

@Controller('consultation-request')
export class ConsultationRequestController {
  constructor(private readonly consultationRequestService: ConsultationRequestService) {}

  @Post()
  create(@Body() createConsultationRequestDto: CreateConsultationRequestDto) {
    return this.consultationRequestService.create(createConsultationRequestDto);
  }

  @Get()
  findAll() {
    return this.consultationRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultationRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultationRequestDto: UpdateConsultationRequestDto) {
    return this.consultationRequestService.update(+id, updateConsultationRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationRequestService.remove(+id);
  }
}
