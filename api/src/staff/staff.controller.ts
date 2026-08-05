import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @ApiOperation({ summary: '교직원 목록 불러오기' })
  @ApiResponse({
    example: {
      message: '교직원 목록을 불러왔습니다.',
      staff: [
        {
          id: 1,
          name: '홍길동',
          position: '교수',
          subrole: '센터장',
          phone: '010-1234-5678',
          email: 'inti@g.yju.ac.kr',
        },
        {
          id: 2,
          name: '김길동',
          position: '교수',
          subrole: '유학생 담당 선생님',
          phone: '010-1234-5678',
          email: 'inti@g.yju.ac.kr',
        },
      ],
    },
  })
  @Get()
  async getStaff() {
    const { staff } = await this.staffService.findAll();
    return {
      message: '교직원 목록을 불러왔습니다.',
      staff: staff,
    };
  }

  @ApiOperation({ summary: '교직원 정보 추가하기' })
  @ApiResponse({
    example: {
      message: '교직원정보가 추가되었습니다.',
    },
  })
  @ApiBody({
    type: CreateStaffDto,
  })
  @UseGuards(AdminGuard)
  @Post()
  async createStaff(@Body() dto: CreateStaffDto) {
    await this.staffService.create(dto);
    return {
      message: '교직원정보가 추가되었습니다.',
    };
  }

  @ApiOperation({ summary: '교직원 정보 수정하기' })
  @ApiResponse({
    example: {
      message: '교직원 정보가 수정되었습니다.',
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
  @ApiOperation({ summary: '교직원 순서 일괄 수정하기' })
  @UseGuards(AdminGuard)
  @Patch('order')
  async updateStaffOrder(@Body() orders: { id: number; sortOrder: number }[]) {
    await this.staffService.updateOrder(orders);
    return {
      message: '교직원 순서가 수정되었습니다.',
    };
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async updateStaff(@Param('id') id: number, @Body() dto: UpdateStaffDto) {
    await this.staffService.update(id, dto);
    return {
      message: '교직원정보가 수정되었습니다.',
    };
  }

  @ApiOperation({ summary: '교직원 정보 삭제하기' })
  @ApiResponse({
    example: {
      message: '교직원 정보가 삭제되었습니다.',
    },
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  })
  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteStaff(@Param('id') id: number) {
    await this.staffService.remove(id);
    return {
      message: '교직원 정보가 삭제되었습니다.',
    };
  }
}
