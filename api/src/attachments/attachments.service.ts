import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import * as fs from 'fs';
import { PostImages } from './entities/post-images.entity';

@Injectable()
export class AttachmentsService {
  constructor(private readonly dataSource: DataSource) {}

  async createImage(
    // content 내부의 image의 데이터를 postImages 테이블에 저장하는 함수
    files: Express.Multer.File[],
    postId: number,
    queryRunner: QueryRunner,
  ) {
    for (let file of files) {
      await queryRunner.manager.save(PostImages, {
        postId,
        filename: file.filename,
        fileSize: file.size,
      });
    }
  }
  async createAttachment(
    // 글의 첨부파일의 데이터를 Attachment 테이블에 저장하는 함수
    files: Express.Multer.File[],
    postId: number,
    queryRunner: QueryRunner,
  ) {
    for (let file of files) {
      await queryRunner.manager.save(Attachment, {
        postId,
        filename: file.filename,
        fileSize: file.size,
        fileType: file.mimetype,
      });
    }
  }
  
  async deleteOldImage(filesnames: string[], queryRunner: QueryRunner) {
    for (let filename of filesnames) {
      await queryRunner.manager.delete(PostImages, {
        filename
      });
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
    }
  }

  async getByPostId(postId: number) {
    return await this.dataSource.manager.findBy(Attachment, { postId });
  }

  async deleteFileAndAttachments(
    filenames: string[],
    queryRunner: QueryRunner,
  ) {
    for (let filename of filenames) {
      console.log(filename);
      await queryRunner.manager.delete(Attachment, { filename });
      const filePath = `/files/${filename}`;
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('파일을 찾을 수 없습니다.');
      }
      fs.unlink(filePath,e=>console.log(e))
    }
    return { message: '파일이 성공적으로 삭제되었습니다.' };
  }

}
