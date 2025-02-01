import { Controller, Get, Post, Body, Res, UseInterceptors, UploadedFile, Req, Query } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { Request, Response } from 'express';
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
      @UploadedFile() file:Express.Multer.File,
      @Req() req:Request
    ){
      
      return {
        message:'파일이 저장되었습니다.',
        url:file.path,
        // filename:file.filename
      }
    }

    @Get()
    async downloadFile(@Res() res:Response,@Query('id') id:number){
      const path=await this.attachmentsService.getDownload(id)
      return res.download(path)
    }
}
