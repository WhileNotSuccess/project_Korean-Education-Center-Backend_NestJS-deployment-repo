import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { DataSource } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { transactional } from 'src/common/utils/transaction-helper';

@Injectable()
export class StaffService {
  constructor(private readonly dataSource: DataSource) {}
  async create(createStaffDto: CreateStaffDto) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.save(Staff, createStaffDto);
    });
  }

  async findAll() {
    const teachers = await this.dataSource.manager
      .createQueryBuilder()
      .select('*')
      .from(Staff, 'staff')
      .where("staff.position = 'teacher'")
      .getRawMany();
    const staffs = await this.dataSource.manager
      .createQueryBuilder()
      .select('*')
      .from(Staff, 'staff')
      .where("staff.position != 'teacher'")
      .getRawMany();

    return {
      teacher: teachers,
      staff: staffs,
    };
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.update(Staff, id, updateStaffDto);
    });
  }

  async remove(id: number) {
    await this.dataSource.manager.delete(Staff, id);
  }
}
