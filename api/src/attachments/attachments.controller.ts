import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { Response } from 'express';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/common/multer-diskoptions';

@Controller('attachments')
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService
  ) {}

    @Post() // 완료
    @UseInterceptors(FileInterceptor('image',multerDiskOptions))
    async createImage(
      @UploadedFile() file:Express.Multer.File
    ){
      return {
        message:'파일이 저장되었습니다.',
        url:file.path
      }
    }
}
