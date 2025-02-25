import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common';
import { ConsultationRequestService } from './consultation-request.service';
import { CreateConsultationRequestDto } from './dto/create-consultation-request.dto';
import { UpdateConsultationRequestDto } from './dto/update-consultation-request.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('consult')
export class ConsultationRequestController {
  constructor(
    private readonly consultationRequestService: ConsultationRequestService,
  ) {}
  @ApiOperation({ summary: '상담신청목록 불러오기' })
  @ApiQuery({
    name: 'isDone',
    description: '상담 완료 여부',
    example: true,
    required: false,
  })
  @ApiResponse({
    example: {
      message: '상담 신청 목록을 불러왔습니다.',
      data: [
        {
          id: 1,
          phone: '010-7553-4001',
          email: 'example@gmail.com',
          schedule: '2025-02-03 05:21:40.630949',
          name: '문성윤',
          isDone: true,
        },
      ],
    },
  })
  @UseGuards(AdminGuard)
  @Get()
  async findAll(
    @Query('isDone', new ParseBoolPipe({ optional: true })) isDone?: boolean,
  ) {
    const result = await this.consultationRequestService.findAll(isDone);
    return {
      message: '상담 신청 목록을 불러왔습니다.',
      data: result,
    };
  }

  @ApiOperation({ summary: '상담 신청 게시하기' })
  @ApiBody({ type: CreateConsultationRequestDto })
  @ApiResponse({
    example: {
      message: '상담 신청이 완료되었습니다.',
    },
  })
  @Post()
  async createConsult(@Body() dto: CreateConsultationRequestDto) {
    await this.consultationRequestService.create(dto);
    return {
      message: '상담 신청이 완료되었습니다.',
    };
  }

  @ApiOperation({ summary: '상담 신청 상태 수정' })
  @ApiBody({ type: UpdateConsultationRequestDto })
  @ApiResponse({
    example: {
      message: '상담 신청 상태를 변경하였습니다.',
    },
  })
  @ApiParam({ name: 'id', description: '상담 신청의 id', example: 1 })
  @UseGuards(AdminGuard)
  @Patch(':id')
  async updateConsult(
    @Body() dto: UpdateConsultationRequestDto,
    @Param('id') id: number,
  ) {
    await this.consultationRequestService.update(id, dto);
    return {
      message: '상담 신청 상태를 변경하였습니다.',
    };
  }

  @ApiOperation({ summary: '상담 신청 삭제' })
  @ApiParam({ name: 'id', description: '상담 신청의 id', example: 1 })
  @ApiResponse({
    example: {
      message: '상담 신청을 성공적으로 삭제하였습니다.',
    },
  })
  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteConsult(@Param('id') id: number) {
    await this.consultationRequestService.remove(id);
    return {
      message: '상담 신청을 성공적으로 삭제하였습니다.',
    };
  }
}
