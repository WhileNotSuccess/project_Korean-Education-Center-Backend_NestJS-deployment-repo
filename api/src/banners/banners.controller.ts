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
  UseGuards,
  Req
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageDiskOptions } from 'src/common/multer-imageDiskoptions';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Banner')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @ApiOperation({ summary: '배너 작성하기' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: '배너 이미지, 필수',
        },
        url: { type: 'string', description: '배너 이미지를 클릭시 이동할 url' },
        expiredDate: { type: 'Date', description: '배너 이미지의 만료일자' },
        language: {
          type: 'string',
          description: '배너 이미지를 띄울 사이트 언어',
        },
      },
    },
  })
  @ApiResponse({
    example: {
      message: '배너가 작성되었습니다.',
    },
  })
  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', ImageDiskOptions))
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    await this.bannersService.create(createBannerDto, file);
    return { message: '배너가 작성되었습니다.' };
  }

  @ApiOperation({ summary: '배너 받아오기' })
  @ApiQuery({
    name: 'ignore',
    example: false,
    description:
      '만료기간(expiredDate)가 지난 글을 불러올지, true면 전부 불러옴, default:false',
    required: false,
  })
  @ApiResponse({
    example: {
      message: '배너를 불러왔습니다.',
      data: [
        {
          id: 1,
          image: '20250204-092604_9e7a66f0-e28e-11ef-81ea-2124a8f9cd05.png',
          language: 'korean',
          expiredDate: '2025-03-01',
          url: 'https://www.naver.com',
        },
      ],
    },
  })
  @Get()
  async findAll(
    @Query('ignore', new DefaultValuePipe(false)) ignore: boolean,
    @Req() req,
  ) {
    const data=await this.bannersService.findAll(
      ignore,
      req.cookies['language'] || 'korean',
    );
    return { message: '배너를 불러왔습니다', data:data }
  }

  @ApiOperation({ summary: '배너 수정하기' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: '배너 이미지',
        },
        expiredDate: { type: 'Date', description: '만료일자' },
        url: { type: 'string', description: '이미지 클릭시 이동할 url' },
        language: {
          type: 'string',
          description: '이미지가 표시될 사이트 언어',
        },
      },
    },
  })
  @ApiResponse({
    example: {
      message: '배너가 수정되었습니다.',
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', ImageDiskOptions))
  async update(
    @Param('id') id: number,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    await this.bannersService.update(id, updateBannerDto, file);
    return { message: '배너가 수정되었습니다.' };
  }

  @ApiOperation({ summary: '배너 삭제하기' })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    example: {
      message: '배너가 삭제되었습니다.',
    },
  })
  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    await this.bannersService.remove(id);
    return {
      message: '배너가 삭제되었습니다.',
    };
  }
}
