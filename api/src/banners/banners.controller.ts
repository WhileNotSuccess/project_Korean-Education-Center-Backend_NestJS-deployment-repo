import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UploadedFile, Query, DefaultValuePipe } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/common/multer-diskoptions';

@Controller('banners')
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file',multerDiskOptions))
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file:Express.Multer.File
  ) {
    return await this.bannersService.create(createBannerDto,file);
  }

  @Get()
  async findAll(@Query('ignore',new DefaultValuePipe(true)) ignore:boolean) {
    return await this.bannersService.findAll(ignore);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file',multerDiskOptions))
  async update(
    @Param('id') id: number, 
    @Body() updateBannerDto: UpdateBannerDto, 
    @UploadedFile() file:Express.Multer.File
  ) {
    await this.bannersService.update(id, updateBannerDto,file);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.bannersService.remove(id);
  }
}
