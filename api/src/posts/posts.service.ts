import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { Multer } from 'multer';
import * as fs from 'fs'
import { transactional } from 'src/common/utils/transaction-helper';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as mime from 'mime-types'
import { AttachmentsController } from 'src/attachments/attachments.controller';
import { json } from 'stream/consumers';
import { Attachment } from 'src/attachments/entities/attachment.entity';


@Injectable()
export class PostsService {
  constructor(
    private readonly datasource:DataSource,
    private readonly attachmentService:AttachmentsService,
    private readonly config:ConfigService
  ){}

  async getOne(find:number|string,language:string){
    let post:Post 
    let files:string[]
    switch(typeof(find)){ //find의 타입 확인해서 string(안내글)과 number(게시글) 분류
      case 'string': //안내글 찾을 경우 
        // post=await this.datasource.manager.findOneBy(Post,{category:find,language})//최신글 하나 가져오는 코드 추가
        post=await this.datasource.manager.createQueryBuilder().select('posts').from(Post,'posts') //Post테이블에서 정보 다 받아오고
        .where('category LIKE :category',{category:find}).andWhere('language LIKE :language',{language}) // 그때 받는 조건 2개
        .orderBy('updatedAt','DESC').getOne() // 최신순 정렬로 하나만 받아옴
        break
      case 'number': //게시글 찾을 경우 
        post=await this.datasource.manager.findOneBy(Post,{id:find})
      }
    
    return {post,files}
    
  }

  async getPagination(category:string,page:number,take:number,language:string){ // 카테고리, 현재 페이지, 가져올 글 개수
    const [value,total]=await this.datasource.manager.findAndCount(Post,{where:{category,language},skip:(page-1)*take,take})
    if(total==0){throw new BadRequestException(`${category}카테고리 글이 존재하지 않습니다.`)}

    const totalPage = Math.ceil(total / take);
    const nextPage = page <= totalPage ? `${this.config.get<string>('BACKEND_URL')}/posts/${category}?limit=${take}&page=${page + 1}` : null;
    const prevPage = page > 1 ? `${this.config.get<string>('BACKEND_URL')}/posts/${category}?limit=${take}&page=${page - 1}` : null;
    
    return { 
      message:`${category}의 ${page}번째 페이지를 불러왔습니다.`,
      data:value,
      currentPage:page,
      prevPage,
      nextPage,
      totalPage,
    }
  }

  async create(files,createPostDto: CreatePostDto,author:string) {
    await transactional<void>(this.datasource, async (queryRunner)=>{
      const post=await queryRunner.manager.save(Post,{...createPostDto,author}) // post 테이블 작성 

      if(createPostDto.imagePath){ //imagePath가 있을경우
        const imagePath=createPostDto.imagePath // image의 경로 배열
        let array=[] // attachment 테이블 생성할 때 쓸 배열
        for(let i in imagePath){
          const fileSize=fs.statSync(imagePath[i]).size //파일 사이즈
          const fileExtension=path.extname(imagePath[i]) // 파일 확장자
          const mimeType=mime.lookup(fileExtension) // 파일의 mimeType
          array.push({filename:path.basename(imagePath[i]),mimetype:mimeType,size:fileSize})// 객체 형태로 만들어서 multer.file타입과 비슷하게 만듬
        }
        await this.attachmentService.create(array,post.id)
      }

      if(!(files.length==0)){
        await this.attachmentService.create(files,post.id)
      }
    })
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await transactional<void>(this.datasource,async (queryRunner)=>{
      await queryRunner.manager.update(Post,id,updatePostDto)
      
    })
  }

  async remove(id: number) {
    await transactional<void>(this.datasource,async (queryRunner)=>{
      await queryRunner.manager.delete(Post,id)
    })
  }

}
