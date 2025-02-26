import {
  Injectable
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { PostImages } from './entities/post-images.entity';

@Injectable()
export class AttachmentsService {
  constructor(private readonly dataSource: DataSource) {}
  async getImageByPostId(id: number) {
    const image = await this.dataSource.manager.findOneBy(PostImages, {
      postId: id,
    });

    return image.filename;
  }
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
        filename,
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
      await queryRunner.manager.delete(Attachment, { filename });
    }
  }
}
