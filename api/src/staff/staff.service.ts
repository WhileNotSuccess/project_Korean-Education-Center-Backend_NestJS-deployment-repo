import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { DataSource } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { transactional } from 'src/common/utils/transaction-helper';

@Injectable()
export class StaffService {
  constructor(private readonly dataSource: DataSource) { }
  async create(createStaffDto: CreateStaffDto) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.save(Staff, createStaffDto);
    });
  }

  async findAll() {
    const staffs = await this.dataSource.manager
      .createQueryBuilder()
      .select('*')
      .from(Staff, 'staff')
      .orderBy('staff.sortOrder', 'ASC')
      .addOrderBy('staff.id', 'ASC')
      .getRawMany();

    return {
      staff: staffs,
    };
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.update(Staff, id, updateStaffDto);
    });
  }

  async updateOrder(orders: { id: number; sortOrder: number }[]) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      for (const order of orders) {
        await queryRunner.manager.update(Staff, order.id, {
          sortOrder: order.sortOrder,
        });
      }
    });
  }

  async remove(id: number) {
    await this.dataSource.manager.delete(Staff, id);
  }
}
