import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseInterceptors, UploadedFiles, BadRequestException, Res, UploadedFile, DefaultValuePipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { Request,Response } from 'express';
import { Multer } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/common/multer-diskoptions';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly attachmentService: AttachmentsService
  ) {}

  @Get() //완료 
  async getOne(@Query('category') category:string,@Query('id') id:number, @Req() req:Request){
    if(category&&id){
      throw new BadRequestException('category와 id중 하나만 입력하세요.') //category와 id 둘 다 입력 받았을 경우 badRequest
    }
    const find = category||+id
    const language=req.cookies['language']||'korean'
    
    if(!language){throw new BadRequestException('cookie에 language가 없습니다.')} // cookie에 language가 없을경우 badRequest
    const {post,files}=await this.postsService.getOne(find,language) //posts 테이블에 찾는 category나 id와 language를 비교해 받아옴
    if(!post){
      return {message:`${find}${typeof(find)==='string'?' 안내글이 없습니다.':'번 게시글이 없습니다.' }`} // 글을 찾지 못했을 경우 없다는 return
    }
    return {
      message:`${find}${typeof(find)==='string'? ' 안내글 및 파일을 불러왔습니다.':'번 게시글 및 파일을 불러왔습니다.'}`,
      data:post,
      files:await this.attachmentService.getByPostId(post.id)
    }
  }

  @Get(':category') // 완료 
  async getAll(
    @Param('category') category:string,
    @Query('limit',new DefaultValuePipe(10)) limit:number,
    @Query('page', new DefaultValuePipe(1)) page:number,
    @Req() req:Request
  ){

    return await this.postsService.getPagination(category,page,limit,req.cookies['language']||'korean')
  }

  @Post() //완료 
  @UseInterceptors(FilesInterceptor('file',10,multerDiskOptions))
  async create(
    @Body() createPostDto: CreatePostDto, 
    @UploadedFiles() files:Express.Multer.File[]
  ) {
    const author='admin' //guard 생성시 삭제
    await this.postsService.create(files,createPostDto,author);
    return {message:'글이 작성되었습니다.'}
  }

  @Patch(':id') //완료
  async update(
    @Param('id') id: number, 
    @Body() updatePostDto: UpdatePostDto,
    ){
    await this.postsService.update(id, updatePostDto);
    return {message:'글이 수정되었습니다.'}
  }
  

  @Delete(':id') // 완료
  async remove(@Param('id') id: number) {
    await this.postsService.remove(id)
    return {message:'글이 삭제되었습니다.'}
  }

  

}
