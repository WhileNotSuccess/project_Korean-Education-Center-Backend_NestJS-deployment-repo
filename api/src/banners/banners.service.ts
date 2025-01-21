import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { DataSource } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { Multer } from 'multer';

@Injectable()
export class BannersService {
  constructor(
    private readonly dataSource:DataSource
  ){}

  async create(createBannerDto: CreateBannerDto,file:Express.Multer.File) {
    await this.dataSource.transaction(async manager=>{
      await manager.save(Banner,{...createBannerDto,image:file.originalname})
    })
  }

  async findAll() {
    return await this.dataSource.createQueryBuilder().select('banner').from(Banner,'banner')
    .where('expiredAt >= NOW()').getMany() // sql문으로 NOW()가 현재 날짜,시간을 계산하여 현재 날짜보다 높은(나중인) banner들을 다 가져옴
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    return await this.dataSource.transaction(async manager=>{
      await manager.update(Banner,id,updateBannerDto)
    })
  }

  async remove(id: number) {
    return await this.dataSource.transaction(async manager=>{
      await manager.delete(Banner,id)
    })
  }
}
