import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { Multer } from 'multer';
import * as fs from 'fs'


@Injectable()
export class PostsService {
  constructor(
    private readonly datasource:DataSource,
    private readonly attachmentService:AttachmentsService
  ){}

  async getOne(find:number|string,language:string){
    let value:Post 
    switch(typeof(find)){ //find의 타입 확인해서 string(안내글)과 number(게시글) 분류
      case 'string': //안내글 찾을 경우 
        // value=await this.datasource.manager.findOneBy(Post,{category:find,language})//최신글 하나 가져오는 코드 추가
        value=await this.datasource.manager.createQueryBuilder().select('posts').from(Post,'posts') //Post테이블에서 정보 다 받아오고
        .where('category LIKE :category',{category:find}).andWhere('language LIKE :language',{language}) // 그때 받는 조건 2개
        .orderBy('createdAt','DESC').getOne() // 최신순 정렬로 하나만 받아옴
        break
      case 'number': //게시글 찾을 경우 
        value=await this.datasource.manager.findOneBy(Post,{id:find})
      }
    return value
    
  }

  async getPagination(category:string,page:number,take:number,language:string){ // 카테고리, 현재 페이지, 가져올 글 개수
    const [value,total]=await this.datasource.manager.findAndCount(Post,{where:{category,language},skip:(page-1)*take,take})
    if(total==0){throw new BadRequestException(`${category}카테고리 글이 존재하지 않습니다.`)}

    const totalPage = Math.ceil(total / take);
    const nextPage = page <= totalPage ? `https://api.bapull.store/posts/${category}?limit=${take}&page=${page + 1}` : null;
    const prevPage = page > 1 ? `https://api.bapull.store/posts/${category}?limit=${take}&page=${page - 1}` : null;
    
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
    await this.datasource.transaction(async manager=>{ //트랜잭션 적용
      const post=await manager.save(Post,{...createPostDto,author}) //저장
      if(files){
        await this.attachmentService.create(files,post.id) //저장한 글의 id를 postId로 받아서 file 저장
      }
    }).catch(e=>{throw new BadRequestException(`${e.sqlMessage}`)})//실패시 오류 띄우기
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.datasource.transaction(async manager=>{
      await manager.update(Post,id,updatePostDto)
    }).catch(e=>{throw new BadRequestException(`${e.sqlMessage}`)})
  }

  async remove(id: number) {
    await this.datasource.transaction(async manager=>{
      await manager.delete(Post,{id:id})
    }).catch(e=>{throw new BadRequestException(`${e.sqlMessage}`)})
  }

}
