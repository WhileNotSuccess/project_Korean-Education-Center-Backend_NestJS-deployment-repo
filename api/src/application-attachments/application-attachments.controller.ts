import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ApplicationAttachmentsService } from './application-attachments.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ApplicationAttachments')
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
      files:{
        id:'number',
        applicationId:'number',
        filename:'string',
        fileSize:'number',
        filetype:'string'
      }
    }
  })
  @Get(':id')
  async getFiles(@Param() id:number){
    return {
      message:'해당 신청의 파일을 불러왔습니다.',
      files:await this.applicationAttachmentsService.findByApplication(id)
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
