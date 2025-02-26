import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { DataSource } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { Multer } from 'multer';
import { transactional } from 'src/common/utils/transaction-helper';

@Injectable()
export class BannersService {
  constructor(private readonly dataSource: DataSource) {}

  async create(createBannerDto: CreateBannerDto, file: Express.Multer.File) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.save(Banner, {
        ...createBannerDto,
        image: file.filename,
      });
    });
  }

  async findAll(ignore: boolean, language: string) {
    const query = await this.dataSource
      .createQueryBuilder()
      .select('banner')
      .from(Banner, 'banner');
    if (!ignore) {
      query.where('banner.expiredDate >= NOW()');
      query.where('banner.language =:language', { language });
    }
    // sql문으로 NOW()가 현재 날짜,시간을 계산하여 현재 날짜보다 높은(나중인) banner들을 다 가져옴
    // ignore가 true 라면 expiredDate 열과 상관없이 모든 Banner를 불러옴
    return { message: '배너를 불러왔습니다', data: await query.getMany() };
  }

  async update(
    id: number,
    updateBannerDto: UpdateBannerDto,
    file: Express.Multer.File,
  ) {
    await transactional(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.update(Banner, id, {
        ...updateBannerDto,
        image: file.filename,
      });
    });
  }

  async remove(id: number) {
    await transactional(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.delete(Banner, id);
    });
  }
}
