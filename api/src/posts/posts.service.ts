import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { ConfigService } from '@nestjs/config';
import { AttachmentsService } from 'src/attachments/attachments.service';


@Injectable()
export class PostsService {
  constructor(
    private readonly datasource:DataSource,
    private readonly configService:ConfigService,
    private readonly attachmentService:AttachmentsService
  ){}

  async getOne(find:number|string,language:string){
    let value:Post
    switch(typeof(find)){ //find의 타입 확인해서 string(안내글)과 number(게시글) 분류
      case 'string': //안내글 찾을 경우 
        value=await this.datasource.manager.findOneBy(Post,{category:find,language})//최신글 하나 가져오는 코드 추가
        break
      case 'number': //게시글 찾을 경우 
        value=await this.datasource.manager.findOneBy(Post,{id:find})
      }
    return value
    
  }

  async getPagination(category:string,page:number,take:number,language:string){ // 카테고리, 현재 페이지, 가져올 글 개수
    const [value,total]=await this.datasource.manager.findAndCount(Post,{where:{category,language},skip:(page-1)*take,take})

    const totalPage = Math.ceil(total / take);
    const nextPage = page <= totalPage ? `https://api.bapull.store/posts/${category}?limit=${take}&page=${page + 1}` : null;
    const prevPage = page > 1 ? `https://api.bapull.store/posts/${category}?limit=${take}&page=${page - 1}` : null;
    console.log(value)
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
      await this.attachmentService.create(files,post.id) //저장한 글의 id를 postId로 받아서 file 저장
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
