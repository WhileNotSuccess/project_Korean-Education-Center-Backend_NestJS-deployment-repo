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

    @Get()  //파일 다운로드 컨트롤러
    async getFile(@Query('id') id:number, @Res() res:Response){
      
      const path=`${__dirname}/../../uploads/posts`
      const fileUrl=await this.attachmentsService.getFile(id,path)
      return res.sendFile(fileUrl) // 파일을 전달후 브라우저가 지원하는 파일형식이면 브라우저에서 열람 가능
      // return res.download(fileUrl) //파일 다운로드 강제
    }

    @Post()
    @UseInterceptors(FileInterceptor('image',multerDiskOptions))
    async createImage(
      @UploadedFile() file:Express.Multer.File
    ){
      return {filename:file.filename}
    }
}
