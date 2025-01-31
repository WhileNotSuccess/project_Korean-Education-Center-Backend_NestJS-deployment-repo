import {
  Controller,
  Post,
  Param,
  Delete,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/common/multer-diskoptions';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @ApiOperation({
    summary: '에디터에서 이미지 업로드할때 쓰는 엔드포인트',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    example: {
      message: '파일이 저장되었습니다.',
      url: '20250201-000654_023b24b0-dfe5-11ef-81bd-8f83f8e6a73a.png',
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image', multerDiskOptions))
  async createImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: '파일이 저장되었습니다.',
      url: file.filename,
    };
  }

  @ApiOperation({ summary: '파일삭제' })
  @ApiParam({
    name: 'filename',
    example: '20250201-000654_023b24b0-dfe5-11ef-81bd-8f83f8e6a73a.png',
  })
  @ApiResponse({
    example: {
      message: '파일이 성공적으로 삭제되었습니다.',
    },
  })
  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    return await this.attachmentsService.deleteFileAndAttachments(filename);
  }
}
