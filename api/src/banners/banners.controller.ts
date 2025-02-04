import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageDiskOptions } from 'src/common/multer-imageDiskoptions';
import { ApiBody, ApiConsumes, ApiExcludeController, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Banner')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @ApiOperation({summary:'배너 작성하기'})  
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        file:{
          type:'string',
          format:'binary',
          description:'배너 이미지, 필수'
        },
        url:{type:'string'},
        expiredDate:{type:'Date'},
        language:{type:'string'},
      }
    }
  })
  @ApiResponse({example:{
    message:'배너가 작성되었습니다.'
  }})
  @Post()
  @UseInterceptors(FileInterceptor('image', ImageDiskOptions))
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.bannersService.create(createBannerDto, file);
    return {message:'배너가 작성되었습니다.'}
  }

  @ApiOperation({summary:'배너 받아오기'})
  @ApiQuery({
    name:'ignore',
    example:false,
    description:'만료기간(expiredDate)가 지난 글을 불러올지, true면 전부 불러옴, default:false',
    required:false
  })
  @ApiResponse({
    example:{
      message:'배너를 불러왔습니다.',
      data:[]
    }
  })
  @Get()
  async findAll(@Query('ignore',new DefaultValuePipe(false)) ignore:boolean) {
    return await this.bannersService.findAll(ignore);
  }

  @ApiOperation({summary:'배너 수정하기'})
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        image:{
          type:'string',
          format:'binary',
          description:'배너 이미지'
        },
        expiredDate:{type:'Date',description:'만료일자'},
        url:{type:'string',description:'이미지 클릭시 이동할 url'},
        language:{type:'string',description:'이미지가 표시될 사이트 언어'},
      }
    }
  })
  @ApiResponse({
    example:{
      message:'배너가 수정되었습니다.'
    }
  })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image',ImageDiskOptions))
  async update(
    @Param('id') id: number,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() file:Express.Multer.File
  ) {
    await this.bannersService.update(id, updateBannerDto,file);
    return {message:'배너가 수정되었습니다.'}
  }

  @ApiOperation({summary:'배너 삭제하기'})
  @ApiParam({
    name:'id',
    example:1
  })
  @ApiResponse({
    example:{
      message:'배너가 삭제되었습니다.'
    }
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.bannersService.remove(id);
    return {
      message:'배너가 삭제되었습니다.'
    }
  }
}
