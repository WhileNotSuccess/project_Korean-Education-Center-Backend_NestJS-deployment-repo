import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { Banner } from 'src/banners/entities/banner.entity';
import { Attachment } from 'src/attachments/entities/attachment.entity';
import { ApplicationAttachment } from 'src/application-attachments/entities/application-attachment.entity';
import { PostImages } from 'src/attachments/entities/post-images.entity';

@Injectable()
export class BatchService {
  constructor(private readonly dataSource: DataSource) {}

  async deleteNotUsedFiles() {
    const storedFilesInServer = fs.readdirSync(`/files`);
    //서버에 저장되어있는 파일 이름들

    const [
      usedFilesAttachments,
      usedFilesBanner,
      usedFilesApplicationAttachment,
      usedFilesPostImages,
    ] = await Promise.all([
      this.dataSource.manager.find(Attachment, { select: ['filename'] }),
      this.dataSource.manager.find(Banner, { select: ['image'] }),
      this.dataSource.manager.find(ApplicationAttachment, {
        select: ['filename'],
      }),
      this.dataSource.manager.find(PostImages, { select: ['filename'] }),
    ]); // 파일 데이터를 저장한 테이블들에서 파일 이름 열을 다 받아옴

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
    ]; //[{filename:'파일이름'}] 형태에서 '파일이름'만 빼서 새로운 배열에 저장

    const deleteFiles = storedFilesInServer.filter(
      (item) => !SrcList.includes(item),
    );
    // 서버에 저장된 파일 중에 사용되고 있는 파일을 제외하고 사용되지 않는 파일들의 배열을 생성

    const CheckNotDeleted = [];
    deleteFiles.map((item) => {
      try {
        fs.unlinkSync(`/files/${item}`);
      } catch (e) {
        CheckNotDeleted.push(item);
      } finally {
      }
    });
    // 각 파일 삭제
  }
}
