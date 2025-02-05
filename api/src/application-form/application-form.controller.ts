import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApplicationFormService } from './application-form.service';
import { CreateApplicationFormDto } from './dto/create-application-form.dto';
import { UpdateApplicationFormDto } from './dto/update-application-form.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDiskOptions } from 'src/common/multer-fileDiskOptions';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiConsumes('application-form')
@Controller('application-form')
export class ApplicationFormController {
  constructor(
    private readonly applicationFormService: ApplicationFormService,
  ) {}

  @ApiOperation({summary:'입학 신청 접수'})
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        file:{
          type:'string',
          format:'binary',
          description:'입학 신청서류'
        },
        course:{type:'string',description:'신청 전공'}
      }
    }
  })  
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    example:{
      message:'입학신청이 접수되었습니다.'
    }
  })
  @Post()
  @UseInterceptors(FileInterceptor('file',FileDiskOptions))
  async createApplication(
    @Body() CreateApplicationFormDto:CreateApplicationFormDto,
    @UploadedFile() file:Express.Multer.File
  ){
    const userId=1 // guard 적용 후 삭제
    await this.applicationFormService.create(CreateApplicationFormDto,file,userId)
    return {message:'입학신청이 접수되었습니다.'}
  }

  @ApiOperation({summary:'입학 신청 불러오기'})
  @ApiQuery({
    name:'ignore',
    example:false,
    description:'이미 처리된(isDone이 true) 신청은 제외하고 불러올지, true면 전부 불러옴, defalut:false',
    required:false
  })
  @ApiQuery({name:'limit',example:10,default:10,required:false})
  @ApiQuery({name:'page',example:1,default:1,required:false})
  @ApiResponse({
    example:{
      message:'입학신청의 1번째 페이지를 불러왔습니다.',
      data:[
        {
          id:1,
          userId:1,
          filename:'20250201-000654_023b24b0-dfe5-11ef-81bd-8f83f8e6a73a.png',
          course:'korean',
          createdDate:'2025-01-31T15:12:47.145Z',
          filetype:'image/png',
          fileSize:300,
          isDone:false
        }
      ],
      currentPage:1,
      prevPage:null,
      nextPage:null,
      totalPage:1
    }
  })
  @Get()
  async getPagination(
    @Query('limit',new DefaultValuePipe(10)) limit:number,
    @Query('page', new DefaultValuePipe(1)) page:number,
    @Query('ignore',new DefaultValuePipe(false)) ignore:boolean
  ){
    return await this.applicationFormService.findPagination(limit,page,ignore)
  }

  @ApiOperation({summary:'입학 신청 수정'})
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        file:{
          type:'string',
          format:'binary',
          description:'입학 신청서류, 선택사항'
        },
        course:{type:'string',description:'신청 전공, 선택 사항'},
        isDone:{type:'boolean',description:'처리 여부, 선택 사항'}
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    example:{message:'입학 신청이 수정되었습니다.'}
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file',FileDiskOptions))
  async updateApplication(
    @Param('id') id:number,
    @UploadedFile() file:Express.Multer.File,
    @Body() UpdateApplicationFormDto:UpdateApplicationFormDto
  ){
    await this.applicationFormService.update(id,UpdateApplicationFormDto,file)
    return {message:'입학 신청이 수정되었습니다.'}
  } 

  @ApiOperation({summary:'입학신청 취소'})
  @ApiParam({name:'id',example:1})
  @ApiResponse({
    example:{message:'입학신청이 취소되었습니다.'}
  })
  @Delete(':id')
  async deleteApplication(
    @Param('id') id:number
  ){
    await this.applicationFormService.remove(id)
    return {message:'입학신청이 취소되었습니다.'}
  }
}
