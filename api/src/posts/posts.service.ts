import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { Multer } from 'multer';
import * as fs from 'fs';
import { transactional } from 'src/common/utils/transaction-helper';
import * as path from 'path';
import * as mime from 'mime-types';
import * as levenshtein from 'fast-levenshtein';
import { findFiles } from 'src/common/fileArrayFind';

@Injectable()
export class PostsService {
  constructor(
    private readonly datasource: DataSource,
    private readonly attachmentService: AttachmentsService
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

  async create(createPostDto: CreatePostDto, author: string,files:Express.Multer.File[]) {
    await transactional<void>(this.datasource, async (queryRunner) => {
      const post = await queryRunner.manager.save(Post, {
        ...createPostDto,
        author,
      }); // post 테이블 작성
      const regex = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
      const createFilenames:string[]=[] // 테이블에 저장할 이미지 파일의 이름을 저장
      let match
      if((match = regex.exec(createPostDto.content)) !== null){ // 정규식으로 작성할 글의 content에서 src속성의 이미지파일 주소를 다 찾아옴
        createFilenames.push((match[1]).replace(`${process.env.BACKEND_URL}/`, '',))// 백엔드 주소를 없애고 filename에 저장
      }
      if(createFilenames){ //저장할 이미지 파일이 있는 경우
        const array=findFiles(createFilenames) // findFiles로 이미지의 데이터를 받아와서
        await this.attachmentService.createImage(array,post.id,queryRunner) // 테이블에 인스턴스 생성
      }
      if(!(files.length==0)){
        await this.attachmentService.createAttahcment(files,post.id,queryRunner) //첨부파일 저장
      }
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto,files:Express.Multer.File[]) {
    const oldPost = await this.datasource.manager.findOneBy(Post, { id });
    const regex = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
    const oldSrcList = []; // 기존에 게시글에 있던 이미지 경로들
    let match;
    while ((match = regex.exec(oldPost.content)) !== null) {
      oldSrcList.push(match[1].replace(`${process.env.BACKEND_URL}/`,'')); //src 속성에 있던 백엔드 주소를 삭제 해서 파일이름만 저장 
    }

    const newSrcList = []; // 새롭게 수정된 게시글에 있는 이미지 경로들
    while ((match = regex.exec(updatePostDto.content)) !== null) {
      newSrcList.push(match[1].replace(`${process.env.BACKEND_URL}/`,'')); //src 속성에 있던 백엔드 주소를 삭제 해서 파일이름만 저장 );
    }
    // oldSrcList - newSrcList 기존에 있었는데 제거된 이미지
    const deleteTarget: string[] = oldSrcList.filter(
      (x) => !newSrcList.includes(x),
    );
    const createTarget: string[] = newSrcList.filter(
      (x)=> !oldSrcList.includes(x)
    )
    await transactional<void>(this.datasource, async (queryRunner) => {
      // 기존 게시글의 이미지를 전부 추출

      if (deleteTarget) {
        let array = [];
        for (let i of deleteTarget) {
          array.push({
            filename: path.basename(i),
          });
        }
        await this.attachmentService.deleteOldImage(array, queryRunner);
      }
      if(createTarget){
        let array = [];
        for (let i of createTarget) {
          array.push(path.basename(i));
        }
        const createArray=findFiles(array)
        await this.attachmentService.createImage(createArray,id, queryRunner);
      }
      // 새로운 이미지 추가

      if(updatePostDto.deleteFilePath){
        const deletePath=JSON.parse(updatePostDto.deleteFilePath)
        await this.attachmentService.deleteFileAndAttachments(deletePath,queryRunner)
      }
      if(!(files.length==0)){await this.attachmentService.createAttahcment(files,id,queryRunner)}
      const { deleteFilePath, ...newPost } = updatePostDto;
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
