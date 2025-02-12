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
import { Banner } from 'src/banners/entities/banner.entity';
import { Post } from 'src/posts/entities/post.entity';
import { ApplicationAttachment } from 'src/application-attachments/entities/application-attachment.entity';
import { PostImages } from './entities/post-images.entity';
import { now } from 'moment';
import { findFiles } from 'src/common/fileArrayFind';

@Injectable()
export class AttachmentsService {
  constructor(private readonly dataSource: DataSource) {}

  async createImage( // content 내부의 image의 데이터를 postImages 테이블에 저장하는 함수 
    files: Express.Multer.File[],
    postId: number,
    queryRunner: QueryRunner,
  ) {
    for (let file of files) {
      await queryRunner.manager.save(PostImages, {
        postId: postId,
        filename: file.filename,
        fileSize: file.size,
      });
    }
  }
  async createAttahcment( // 글의 첨부파일의 데이터를 Attachment 테이블에 저장하는 함수
    files:Express.Multer.File[],
    postId:number,
    queryRunner:QueryRunner
  ){
    for(let file of files){
      await queryRunner.manager.save(Attachment,{
        postId,
        filename:file.filename,
        fileSize:file.size,
        fileType:file.mimetype
      })
    }
  }

  async deleteOldImage(files: Express.Multer.File[], queryRunner: QueryRunner) {
    for (let file of files) {
      await queryRunner.manager.delete(PostImages, {
        filename: file.filename,
      });
      const filePath=`/files/${file.filename}`
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

  async deleteFileAndAttachments(filenames: string[],queryRunner:QueryRunner) {

    for(let filename of filenames){
      console.log(filename)
      await queryRunner.manager.delete(Attachment,{filename})
      const filePath=`/files/${filename}`
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
    return { message: '파일이 성공적으로 삭제되었습니다.' };
  }

  async deleteNotUsedFiles() {
    const storedFiles = fs.readdirSync(`/files`);

    const [
      usedFilesAttachments,
      usedFilesBanner,
      usedFilesApplicationAttachment,
      usedFilesPost,
      usedFilesPostImages,
    ] = await Promise.all([
      this.dataSource.manager.find(Attachment, { select: ['filename'] }),
      this.dataSource.manager.find(Banner, { select: ['image'] }),
      this.dataSource.manager.find(ApplicationAttachment, { select: ['filename'] }),
      this.dataSource.manager.find(Post, { select: ['content'] }),
      this.dataSource.manager.find(PostImages, { select: ['filename'] }),
    ]); //join 해서 받아오기
    const regex = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
    const SrcList = [
      ...usedFilesApplicationAttachment.map((item) => {
        return item.filename;
      }),
      ...usedFilesAttachments.map((item) => {
        return item.filename;
      }),
      ...usedFilesBanner.map((item) => {
        return item.image;
      }),
      ...usedFilesPostImages.map((item) => {
        return item.filename;
      }),
    ];
    let match;

    usedFilesPost.map((item) => {
      while ((match = regex.exec(item.content)) !== null) {
          if(!(match[1][0]==='d')){ // 인코딩 되어 데이터 자체가 들어간 img를 제외
            SrcList.push(match[1].replace(`${process.env.BACKEND_URL}/`,'')); 
            // // 정규식으로 찾아 추출한 문자열이 1번 인덱스에 저장, 백엔드 주소 제거해서 SrcList에 저장
          }
      }
    });
    //SrcList 에 사용된 src속성의 파일이름들을 저장

    const deleteFiles = storedFiles.filter((item) => !SrcList.includes(item));
    try {
      deleteFiles.map((item) => {
        fs.unlinkSync(`/files/${item}`);
      });
      const deletedFile=deleteFiles.join('\t')
      const restoreRow=`[${new Date().getDate()}]`+deletedFile
      fs.appendFileSync('/cron_delete.txt',restoreRow+`\n`)
    } catch (e) {
      console.log(e);
    }
    //삭제된 파일명 저장해두는 파일 만들기

  }
}
