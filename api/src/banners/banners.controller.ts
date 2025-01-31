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
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/common/multer-diskoptions';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerDiskOptions))
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFiles() file: Express.Multer.File,
  ) {
    return await this.bannersService.create(createBannerDto, file);
  }

  @Get()
  async findAll() {
    return await this.bannersService.findAll();
  }

  @Patch(':id')
  @UseInterceptors()
  async update(
    @Param('id') id: number,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    await this.bannersService.update(+id, updateBannerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.bannersService.remove(+id);
  }
}
