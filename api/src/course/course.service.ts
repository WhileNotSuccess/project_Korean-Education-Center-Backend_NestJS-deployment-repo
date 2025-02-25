import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { DataSource } from 'typeorm';
import { transactional } from 'src/common/utils/transaction-helper';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(private dataSource: DataSource) {}
  async create(createCourseDto: CreateCourseDto) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.save(Course, createCourseDto);
    });
    return { message: '새로운 강좌가 생성되었습니다.' };
  }

  async findAll() {
    return {
      message: '강좌 목록을 불러왔습니다.',
      data: await this.dataSource.manager.find(Course),
    };
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await transactional(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.update(Course, id, updateCourseDto);
    });
    return {
      message: '강좌명이 수정되었습니다.',
    };
  }

  async remove(id: number) {
    await transactional(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.delete(Course, id);
    });
    return {
      message: '강좌를 삭제했습니다.',
    };
  }
}
