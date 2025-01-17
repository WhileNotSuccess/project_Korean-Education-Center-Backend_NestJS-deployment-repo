import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseInterceptors, UploadedFiles, BadRequestException, Res } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { Request } from 'express';
import { Multer } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/common/multer-diskoptions';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly attachmentService: AttachmentsService
  ) {}

  @Get() //완료 
  async getOne(@Query('category') category:string,@Query('id') id:number, @Req() req:Request){
    const find = category||+id
    if(category&&id){
      throw new BadRequestException('category와 id중 하나만 입력하세요.')
    }
    const language=req.cookies['language']
    if(!language){throw new BadRequestException('cookie에 language가 없습니다.')}
    const post=await this.postsService.getOne(find,language) //posts 테이블에 찾는 category나 id와 language를 비교해 받아옴
    if(!post){
      return {message:`${find}${typeof(find)==='string'?' 안내글이 없습니다.':'번 게시글이 없습니다.' }`}
    }
    return {
      message:`${find}${typeof(find)==='string'? ' 안내글 및 파일을 불러왔습니다.':'번 게시글 및 파일을 불러왔습니다.'}`,
      data:post,
      files:await this.attachmentService.get(post.id)
    }
  }

  @Get('attachment')  //파일 다운로드 컨트롤러
  async getFile(@Query() id:number, @Res() res:Response){
    const file=await this.attachmentService.getFile(id)
    const path=`${__dirname}/../../`
    console.log(path)
    // res.download(`${this.config.get('base_url')}/${path}/${name}`, fileName)`)

  }

  @Get(':category') // 완료 
  async getAll(
    @Param('category') category:string,
    @Query('limit') limit:number,
    @Query('page') page:number,
    @Req() req:Request
  ){
    page=page?page:1
    limit=limit?limit:10
    return await this.postsService.getPagination(category,page,limit,req.cookies['language'])
  }

  @Post() //완료 
  @UseInterceptors(FilesInterceptor('file',10,multerDiskOptions))
  async create(
    @Body() createPostDto: CreatePostDto, 
    @UploadedFiles() files:Express.Multer.File[]
  ) {
    const author='admin'

    // const post =await this.postsService.create(files,createPostDto,author);
    await this.postsService.create(files,createPostDto,author);
    // await this.attachmentService.create(files,post.id)
    return {message:'글이 작성되었습니다.'}
  }

  @Patch(':id') //완료 
  @UseInterceptors(FilesInterceptor('file',10,multerDiskOptions))
  async update(
    @Param('id') id: number, @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files:Express.Multer.File[]
    ) {
    await this.postsService.update(id, updatePostDto);
    return {message:'글이 수정되었습니다.'}
  }

  @Delete(':id') // 미완
  async remove(@Param('id') id: number) {
    // 글 삭제시 파일도 다 지울까
    await this.postsService.remove(id);
    return {message:'글이 삭제되었습니다.'}
  }


}
