import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicationAttachmentsService } from './application-attachments.service';
import { CreateApplicationAttachmentDto } from './dto/create-application-attachment.dto';
import { UpdateApplicationAttachmentDto } from './dto/update-application-attachment.dto';
import { ApiConsumes, ApiExcludeController, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiConsumes('applicationAttachments')
@Controller('application-attachments')
export class ApplicationAttachmentsController {
  constructor(private readonly applicationAttachmentsService: ApplicationAttachmentsService) {}
  
  @ApiOperation({summary:'입학신청 파일 불러오기'})
  @ApiParam({
    name:'id',
    example:1
  })
  @ApiResponse({
    example:{
      message:'해당 신청의 파일을 불러왔습니다.',
      file:{
        id:'number',
        applicationId:'number',
        filename:'string',
        fileSize:'number',
        filetype:'string'
      }
    }
  })
  @Get(':id')
  async getOne(@Param() id:number){
    return {
      message:'해당 신청의 파일을 불러왔습니다.',
      file:await this.applicationAttachmentsService.findByApplication(id)
    }
  }
  @ApiOperation({summary:'입학신청 파일 1개 삭제하기'})
  @ApiParam({
    name:'id',
    description:'삭제할 파일의 id'
  })
  @ApiResponse({
    example:{
      message:'삭제되었습니다.'
    }
  })
  @Delete(':id')
  async deleteOne(@Param('id') id:number){
    await this.applicationAttachmentsService.deleteOne(id)
  }
  
}
