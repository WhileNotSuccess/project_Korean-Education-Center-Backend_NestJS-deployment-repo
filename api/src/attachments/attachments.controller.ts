import {
  Controller,
  Post,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  Get,
  UseGuards,
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
import { AuthGuard } from 'src/auth/guards/auth.guard';

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
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', ImageDiskOptions))
  async createImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: '이미지가 저장되었습니다.',
      url: file.filename,
    };
  }

  @ApiOperation({ summary: '파일 다운로드' })
  @ApiParam({
    name: 'filename',
    example: '20250201-000654_023b24b0-dfe5-11ef-81bd-8f83f8e6a73a.png',
  })
  @ApiResponse({
    example: {
      download: 'file',
    },
  })
  @Get(':filename') //다운로드
  async downloadFile(
    @Res() res: Response,
    @Param('filename') filename: string,
  ) {
    return res.download(`/files/${filename}`);
  }
}
