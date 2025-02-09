import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { Multer } from 'multer';
import * as fs from 'fs';
import { transactional } from 'src/common/utils/transaction-helper';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as mime from 'mime-types';
import { query } from 'express';
import { Attachment } from 'src/attachments/entities/attachment.entity';
import * as levenshtein from 'fast-levenshtein';

@Injectable()
export class PostsService {
  constructor(
    private readonly datasource: DataSource,
    private readonly attachmentService: AttachmentsService,
    private readonly config: ConfigService,
  ) {}

  async getOne(find: number | string, language: string) {
    let post: Post;

    switch (
      typeof find //find의 타입 확인해서 string(안내글)과 number(게시글) 분류
    ) {
      case 'string': //안내글 찾을 경우
        // post=await this.datasource.manager.findOneBy(Post,{category:find,language})//최신글 하나 가져오는 코드 추가
        post = await this.datasource.manager
          .createQueryBuilder()
          .select('posts')
          .from(Post, 'posts') //Post테이블에서 정보 다 받아오고
          .where('category LIKE :category', { category: find })
          .andWhere('language LIKE :language', { language }) // 그때 받는 조건 2개
          .orderBy('updatedDate', 'DESC')
          .getOne(); // 최신순 정렬로 하나만 받아옴
        break;
      case 'number': //게시글 찾을 경우
        post = await this.datasource.manager.findOneBy(Post, { id: find });
    }

    return post;
  }

  async getPagination(
    category: string,
    page: number,
    take: number,
    language: string,
  ) {
    // 카테고리, 현재 페이지, 가져올 글 개수
    const [value, total] = await this.datasource.manager.findAndCount(Post, {
      where: { category, language },
      skip: (page - 1) * take,
      take,
      order: { updatedDate: 'DESC' },
    });
    if (total == 0) {
      throw new BadRequestException(
        `${category}카테고리 글이 존재하지 않습니다.`,
      );
    }

    const totalPage = Math.ceil(total / take);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      message: `${category}의 ${page}번째 페이지를 불러왔습니다.`,
      data: value,
      currentPage: page,
      prevPage,
      nextPage,
      totalPage,
    };
  }

  async create(files, createPostDto: CreatePostDto, author: string) {
    await transactional<void>(this.datasource, async (queryRunner) => {
      const post = await queryRunner.manager.save(Post, {
        ...createPostDto,
        author,
      }); // post 테이블 작성

      if (createPostDto.imagePath) {
        //imagePath가 있을경우

        const imagePath = JSON.parse(createPostDto.imagePath); // image의 경로 배열
        let array = []; // attachment 테이블 생성할 때 쓸 배열
        for (let i in imagePath) {
          const fileSize = fs.statSync(`/files/${imagePath[i]}`).size; //파일 사이즈
          const fileExtension = path.extname(`/files/${imagePath[i]}`); // 파일 확장자
          const mimeType = mime.lookup(fileExtension); // 파일의 mimeType
          array.push({
            filename: path.basename(imagePath[i]),
            mimetype: mimeType,
            size: fileSize,
          }); // 객체 형태로 만들어서 multer.file타입과 비슷하게 만듬
        }
        await this.attachmentService.create(array, post.id, queryRunner);
      }

      if (!(files.length == 0)) {
        await this.attachmentService.create(files, post.id, queryRunner);
      }
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await transactional<void>(this.datasource, async (queryRunner) => {
      // 기존 게시글의 이미지를 전부 추출
      const oldPost = await queryRunner.manager.findOneBy(Post, { id });
      const html = oldPost.content;
      const regex = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
      const oldSrcList = []; // 기존에 게시글에 있던 이미지 경로들
      let match;
      while ((match = regex.exec(html)) !== null) {
        oldSrcList.push(match[1]); // 정규식으로 찾아 추출한 문자열이 1번 인덱스에 저장
      }
      const newHtml = updatePostDto.content;
      const newSrcList = []; // 새롭게 수정된 게시글에 있는 이미지 경로들
      while ((match = regex.exec(newHtml)) !== null) {
        newSrcList.push(match[1]);
      }
      // oldSrcList - newSrcList 기존에 있었는데 제거된 이미지
      const deleteTarget: string[] = oldSrcList.filter(
        (x) => !newSrcList.includes(x),
      );
      if (deleteTarget) {
        let array = [];
        for (let i in deleteTarget) {
          const targetFile = deleteTarget[i].replace(
            //src 속성에 있던 백엔드 주소를 삭제
            `${process.env.BACKEND_URL}/`,
            '',
          );
          array.push({
            filename: path.basename(targetFile),
          });
        }
        await this.attachmentService.deleteOldImage(array, queryRunner);
      }

      // 새로운 이미지 추가
      if (updatePostDto.imagePath) {
        //imagePath가 있을경우
        const imagePath = JSON.parse(updatePostDto.imagePath); // image의 경로 배열
        let array = []; // attachment 테이블 생성할 때 쓸 배열
        for (let i in imagePath) {
          const fileSize = fs.statSync(`/files/${imagePath[i]}`).size; //파일 사이즈
          const fileExtension = path.extname(`/files/${imagePath[i]}`); // 파일 확장자
          const mimeType = mime.lookup(fileExtension); // 파일의 mimeType
          array.push({
            filename: path.basename(imagePath[i]),
            mimetype: mimeType,
            size: fileSize,
          }); // 객체 형태로 만들어서 multer.file타입과 비슷하게 만듬
        }
        await this.attachmentService.create(array, id, queryRunner);
      }
      const { imagePath, ...newPost } = updatePostDto;
      await queryRunner.manager.update(Post, id, newPost);
    });
  }

  async remove(id: number) {
    await transactional<void>(this.datasource, async (queryRunner) => {
      await queryRunner.manager.delete(Post, id);
    });
  }

  async search(
    category: string,
    page: number,
    limit: number,
    title?: string,
    author?: string,
    content?: string,
  ) {
    const queryBuilder = this.datasource.manager.createQueryBuilder();
    queryBuilder.from(Post, 'post');
    queryBuilder.where('category = :category', { category });
    queryBuilder.select('*');
    let results = await queryBuilder.getRawMany();

    if (title) {
      results = results
        .map((post) => ({
          post,
          include: (post.title as string).indexOf(title) !== -1,
          distance: levenshtein.get(post.title, title),
        }))
        .sort(this.sort)
        .map((entry) => entry.post);
    }
    if (author) {
      results = results
        .map((post) => ({
          post,
          include: (post.author as string).indexOf(author) !== -1,
          distance: levenshtein.get(post.author, author),
        }))
        .sort(this.sort)
        .map((entry) => entry.post);
    }
    if (content) {
      results = results
        .map((post) => ({
          post,
          include: (post.content as string).indexOf(content) !== -1,
          distance: levenshtein.get(post.content, content),
        }))
        .sort(this.sort)
        .map((entry) => entry.post);
    }
    // 페이지가 1인 경우 limit * 0 ~ limit * 1 - 1 까지

    const totalPage = Math.ceil(results.length / limit);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      message: `검색결과를 불러왔습니다.`,
      data: results.slice(limit * (page - 1), limit * page),
      currentPage: page,
      prevPage,
      nextPage,
      totalPage,
    };
  }
  private sort(a, b) {
    console.log(a);
    console.log(b);
    if ((a.include && b.include) || (!a.include && !b.include)) {
      if (a.distance === b.distance) {
        return a.post.id - b.post.id;
      }
      return a.distance - b.distance;
    }
    if (a.include && !b.include) {
      return -1;
    }
    if (!a.include && b.include) {
      return 1;
    }
  }
}
