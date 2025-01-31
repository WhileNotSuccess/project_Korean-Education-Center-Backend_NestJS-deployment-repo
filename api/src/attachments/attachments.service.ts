import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import * as fs from 'fs';
import * as path from 'path';
import { transactional } from 'src/common/utils/transaction-helper';

@Injectable()
export class AttachmentsService {
  constructor(private readonly dataSource: DataSource) {}

  async create(
    files: Express.Multer.File[],
    postId: number,
    queryRunner: QueryRunner,
  ) {
    for (const file of files) {
      await queryRunner.manager.save(Attachment, {
        postId: postId,
        filename: file.filename,
        fileType: file.mimetype,
        fileSize: file.size,
      });
    }
  }
  async deleteOldImage(files: Express.Multer.File[], queryRunner: QueryRunner) {
    for (const file of files) {
      await queryRunner.manager.delete(Attachment, {
        filename: file.filename,
      });
    }
  }

  async getByPostId(postId: number) {
    return await this.dataSource.manager.findBy(Attachment, { postId });
  }

  async deleteFileAndAttachments(filename: string) {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.delete(Attachment, { filename });
      const filePath = `/files/${filename}`;
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('파일을 찾을 수 없습니다.');
      }
      fs.unlink(filePath, (error) => {
        if (error) {
          throw new HttpException(
            '파일 삭제 중 오류가 발생했습니다.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    });
    return { message: '파일이 성공적으로 삭제되었습니다.' };
  }
}
