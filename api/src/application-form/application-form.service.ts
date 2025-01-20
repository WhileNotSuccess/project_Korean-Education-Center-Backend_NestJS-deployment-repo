import { Injectable } from '@nestjs/common';
import { CreateApplicationFormDto } from './dto/create-application-form.dto';
import { UpdateApplicationFormDto } from './dto/update-application-form.dto';

@Injectable()
export class ApplicationFormService {
  create(createApplicationFormDto: CreateApplicationFormDto) {
    return 'This action adds a new applicationForm';
  }

  findAll() {
    return `This action returns all applicationForm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applicationForm`;
  }

  update(id: number, updateApplicationFormDto: UpdateApplicationFormDto) {
    return `This action updates a #${id} applicationForm`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicationForm`;
  }
}
