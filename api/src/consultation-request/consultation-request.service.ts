import { Injectable } from '@nestjs/common';
import { CreateConsultationRequestDto } from './dto/create-consultation-request.dto';
import { UpdateConsultationRequestDto } from './dto/update-consultation-request.dto';
import { DataSource } from 'typeorm';
import { ConsultationRequest } from './entities/consultation-request.entity';
import { transactional } from 'src/common/utils/transaction-helper';

@Injectable()
export class ConsultationRequestService {
  constructor(private readonly dataSource: DataSource) {}
  async create(createConsultationRequestDto: CreateConsultationRequestDto) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.save(
        ConsultationRequest,
        createConsultationRequestDto,
      );
    });
  }

  async findAll(isDone?: boolean) {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder()
      .select('*')
      .from(ConsultationRequest, 'consult');

    if (typeof isDone === 'boolean') {
      queryBuilder.where('consult.isDone = :isDone', { isDone });
    }

    return await queryBuilder.getRawMany();
  }

  async update(
    id: number,
    updateConsultationRequestDto: UpdateConsultationRequestDto,
  ) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.update(
        ConsultationRequest,
        id,
        updateConsultationRequestDto,
      );
    });
  }

  async remove(id: number) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.delete(ConsultationRequest, id);
    });
  }
}
