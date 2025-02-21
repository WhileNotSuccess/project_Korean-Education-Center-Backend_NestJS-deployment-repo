import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  DefaultValuePipe,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApplicationFormService } from './application-form.service';
import { CreateApplicationFormDto } from './dto/create-application-form.dto';
import { UpdateApplicationFormDto } from './dto/update-application-form.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileDiskOptions } from 'src/common/multer-fileDiskOptions';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('ApplicationForm')
@Controller('application-form')
export class ApplicationFormController {
  constructor(
    private readonly applicationFormService: ApplicationFormService,
  ) {}

  @ApiOperation({ summary: '입학 신청 접수' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
          description: '입학 신청서류',
        },
        course: { type: 'string', description: '신청 전공' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    example: {
      message: '입학신청이 접수되었습니다.',
    },
  })
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, FileDiskOptions))
  async createApplication(
    @Body() CreateApplicationFormDto: CreateApplicationFormDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = 1; // guard 적용 후 삭제
    await this.applicationFormService.create(
      CreateApplicationFormDto,
      files,
      userId,
    );
    return { message: '입학신청이 접수되었습니다.' };
  }

  @ApiOperation({ summary: '입학 신청 불러오기' })
  @ApiQuery({
    name: 'ignore',
    example: false,
    description:
      '이미 처리된(isDone이 true) 신청은 제외하고 불러올지, true면 전부 불러옴, defalut:false',
    required: false,
  })
  @ApiQuery({ name: 'limit', example: 10, default: 10, required: false })
  @ApiQuery({ name: 'page', example: 1, default: 1, required: false })
  @ApiResponse({
    example: {
      message: '입학신청의 1번째 페이지를 불러왔습니다.',
      data: [
        {
          id: 1,
          userId: 1,
          course: 'korean',
          createdDate: '2025-01-31T15:12:47.145Z',
          isDone: false,
          userName: '문성윤',
          userEmail: 'intel@gmail.com',
          attachments: [
            {
              id: 1,
              applicationId: 1,
              filename: 'string',
              fileSize: 45621,
              filetype: 'string',
            },
          ],
        },
      ],
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPage: 1,
    },
  })
  @Get()
  async getPagination(
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('ignore', new DefaultValuePipe(false)) ignore: boolean,
  ) {
    return await this.applicationFormService.findPagination(
      limit,
      page,
      ignore,
    );
  }

  @ApiOperation({ summary: '입학 신청 수정' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
          description:
            '새로 추가하는 입학 신청서류, 서류가 없을 경우 필수 아님',
        },
        course: { type: 'string', description: '신청 전공, 필수 아님' },
        isDone: { type: 'boolean', description: '처리 여부, 필수 아님' },
        deleteFilePath: {
          type: 'string',
          description: '삭제할 파일 이름 배열을 string형태로 한 것',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    example: { message: '입학 신청이 수정되었습니다.' },
  })
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 10, FileDiskOptions))
  async updateApplication(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[], // 새로 추가되는 파일만 받음
    @Body() updateApplicationFormDto: UpdateApplicationFormDto,
  ) {
    console.log(updateApplicationFormDto);
    await this.applicationFormService.update(
      id,
      updateApplicationFormDto,
      files,
    );
    return { message: '입학 신청이 수정되었습니다.' };
  }

  @ApiOperation({ summary: '입학신청 취소' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    example: { message: '입학신청이 취소되었습니다.' },
  })
  @Delete(':id')
  async deleteApplication(@Param('id') id: number) {
    await this.applicationFormService.remove(id);
    return { message: '입학신청이 취소되었습니다.' };
  }

  @ApiOperation({ summary: '일반 유저가 확인할 자신의 입학 신청 글 ' })
  @ApiResponse({
    example: {
      message: '유저의 입학정보를 불러왔습니다.',
      data: [
        {
          id: 1,
          course: 'korean',
          createdDate: '2023-12-78',
          isDone: false,
        },
      ],
    },
  })
  @Get('user')
  async findUserApplication() {
    const user = { id: 1 }; //guard 적용 후 삭제
    const Form = await this.applicationFormService.findApplicationByUser(
      user.id,
    );
    return {
      message: '유저의 입학정보를 불러왔습니다.',
      data: Form,
    };
  }
}
