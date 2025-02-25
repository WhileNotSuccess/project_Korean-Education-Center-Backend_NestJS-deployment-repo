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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: '강좌 추가' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ example: { message: '새로운 강좌가 생성되었습니다.' } })
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @ApiOperation({ summary: '강좌 목록 불러오기' })
  @ApiResponse({
    example: {
      message: '강좌 목록을 불러왔습니다.',
      data: {},
    },
  })
  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @ApiOperation({ summary: '강좌 수정' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ example: { message: '강좌명이 수정되었습니다.' } })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.update(+id, updateCourseDto);
  }

  @ApiOperation({ summary: '강좌 삭제' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ example: { message: '강좌를 삭제했습니다.' } })
  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.courseService.remove(+id);
  }
}
