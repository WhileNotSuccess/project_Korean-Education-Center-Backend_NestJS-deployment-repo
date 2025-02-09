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
  Get,
  Body,
  Put,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { AttachmentsService } from './attachments.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageDiskOptions } from 'src/common/multer-imageDiskoptions';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { FileDiskOptions } from 'src/common/multer-fileDiskOptions';
import { Cron } from '@nestjs/schedule';

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
      message: '이미지가 저장되었습니다.',
      url: '20250201-000654_023b24b0-dfe5-11ef-81bd-8f83f8e6a73a.png',
    },
  })
  @Post('image')
  @UseInterceptors(FileInterceptor('image', ImageDiskOptions))
  async createImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: '이미지가 저장되었습니다.',
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

  @ApiOperation({ summary: '파일 다운로드' })
  @ApiParam({
    name: 'filename',
    example: '20250201-000654_023b24b0-dfe5-11ef-81bd-8f83f8e6a73a.png',
  })
  @ApiResponse({
    example: {
      download: 'files',
    },
  })
  @Get(':filename') //다운로드
  async downloadFile(
    @Res() res: Response,
    @Param('filename') filename: string,
  ) {
    return res.download(`/files/${filename}`);
  }

  @ApiOperation({ summary: '글 수정 중 파일 업로드' })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ example: { message: '파일 추가 완료' } })
  @Post(':id')
  @UseInterceptors(FileInterceptor('file', FileDiskOptions))
  async addAttachmentFile(
    @Param() id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.attachmentsService.addAttachmentFile(id, file);
    return { message: '파일 추가 완료' };
  }

  @Cron('0 0 4 * * 4') // 목요일 4시에 작동
  async deleteRestedFiles() {
    await this.attachmentsService.deleteNotUsedFiles();
  }
}
