import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: '강사, 교직원 목록 불러오기' })
  @ApiResponse({
    example: {
      message: '강사, 교직원 목록을 불러왔습니다.',
      teacher: [
        {
          id: 1,
          name: '성춘향',
          position: 'teacher',
          phone: '010-1234-5678',
          email: 'teacher@gmail.com',
        },
      ],
      staff: [
        {
          id: 2,
          name: '홍길동',
          position: '국제교류원장',
          phone: '010-1234-5678',
          email: 'inti@g.yju.ac.kr',
        },
      ],
    },
  })
  @Get()
  async getStaff() {
    const { teacher, staff } = await this.staffService.findAll();
    return {
      message: '강사, 교직원 목록을 불러왔습니다.',
      teacher: teacher,
      staff: staff,
    };
  }

  @ApiOperation({ summary: '강사, 교직원 정보 추가하기' })
  @ApiResponse({
    example: {
      message: '강사, 교직원정보가 추가되었습니다.',
    },
  })
  @ApiBody({
    type: CreateStaffDto,
  })
  @Post()
  async createStaff(@Body() dto: CreateStaffDto) {
    await this.staffService.create(dto);
    return {
      message: '강사, 교직원정보가 추가되었습니다.',
    };
  }

  @ApiOperation({ summary: '강사, 교직원 정보 수정하기' })
  @ApiResponse({
    example: {
      message: '강사, 교직원 정보가 수정되었습니다.',
    },
  })
  @ApiBody({
    type: CreateStaffDto,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  })
  @Patch(':id')
  async updateStaff(@Param('id') id: number, @Body() dto: UpdateStaffDto) {
    await this.staffService.update(id, dto);
    return {
      message: '강사, 교직원정보가 수정되었습니다.',
    };
  }

  @ApiOperation({ summary: '강사, 교직원 정보 삭제하기' })
  @ApiResponse({
    example: {
      message: '강사, 교직원 정보가 삭제되었습니다.',
    },
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  })
  @Delete(':id')
  async deleteStaff(@Param('id') id: number) {
    await this.staffService.remove(id);
    return {
      message: '강사, 교직원 정보가 삭제되었습니다.',
    };
  }
}
