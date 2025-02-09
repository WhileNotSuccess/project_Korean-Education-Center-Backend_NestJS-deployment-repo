import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Res,
  UploadedFile,
  DefaultValuePipe,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { Request, Response } from 'express';
import { Multer } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageDiskOptions } from 'src/common/multer-imageDiskoptions';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileDiskOptions } from 'src/common/multer-fileDiskOptions';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly attachmentService: AttachmentsService,
  ) {}
  @ApiOperation({ summary: '검색하기' })
  @ApiQuery({
    name: 'title',
    example: '공지사항',
    description: '제목',
    required: false,
  })
  @ApiQuery({
    name: 'content',
    example: '내용',
    description: '게시글 내부 내용',
    required: false,
  })
  @ApiQuery({
    name: 'category',
    example: 'notice',
    description: '카테고리',
    required: false,
  })
  @ApiQuery({
    name: 'author',
    example: 'admin',
    description: '작성자',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    required: false,
    default: 1,
  })
  @Get('search')
  async search(
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('category') category: string,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('content') content?: string,
  ) {
    const filter = { title, author, content };
    const selectedFilters = Object.values(filter).filter((value) => value);
    if (selectedFilters.length !== 1) {
      throw new BadRequestException(
        'category, title, author, content 중 하나만 선택해야 합니다.',
      );
    }
    return await this.postsService.search(
      category,
      page,
      limit,
      title,
      author,
      content,
    );
  }

  @ApiOperation({ summary: '하나의 post 가져오기' })
  @ApiQuery({
    name: 'category',
    example: 'notice',
    description: 'id와 동시에 사용불가',
    required: false,
  })
  @ApiQuery({
    name: 'id',
    example: 1,
    description: 'category와 동시에 사용불가',
    required: false,
  })
  @ApiResponse({
    example: {
      message: 'notice 안내글 및 파일을 불러왔습니다.',
      data: {
        id: 1,
        title: 'asdf',
        content: '<p>asdf</p>',
        author: 'admin',
        category: 'notice',
        createdDate: '2025-01-31T15:12:47.145Z',
        updatedDate: '2025-01-31T15:12:58.281Z',
        language: 'korean',
        expiredDate: null,
      },
      files: [],
    },
  })
  @Get()
  async getOne(
    @Query('category') category: string,
    @Query('id') id: number,
    @Req() req: Request,
  ) {
    if (category && id) {
      throw new BadRequestException('category와 id중 하나만 입력하세요.'); //category와 id 둘 다 입력 받았을 경우 badRequest
    }
    const find = category || +id;
    const language = req.cookies['language'] || 'korean';

    const post = await this.postsService.getOne(find, language); //posts 테이블에 찾는 category나 id와 language를 비교해 받아옴
    if (!post) {
      throw new NotFoundException(
        `${find}${typeof find === 'string' ? ' 안내글이 없습니다.' : '번 게시글이 없습니다.'}`,
      );
      // 글을 찾지 못했을 경우 없다는 return
    }
    return {
      message: `${find}${typeof find === 'string' ? ' 안내글 및 파일을 불러왔습니다.' : '번 게시글 및 파일을 불러왔습니다.'}`,
      data: post,
      files: await this.attachmentService.getByPostId(post.id),
    };
  }

  @ApiOperation({ summary: '해당 카테고리의 모든 post 가져오기' })
  @ApiParam({
    name: 'category',
    example: 'notice',
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    required: false,
    default: 1,
  })
  @ApiResponse({
    example: {
      message: 'notice의 1번째 페이지를 불러왔습니다.',
      data: [
        {
          id: 1,
          title: 'asdf',
          content: '<p>asdf</p>',
          author: 'admin',
          category: 'notice',
          createdDate: '2025-01-31T15:12:47.145Z',
          updatedDate: '2025-01-31T15:12:58.281Z',
          language: 'korean',
          expiredDate: null,
        },
      ],
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPage: 1,
    },
  })
  @Get(':category') // 완료
  async getAll(
    @Param('category') category: string,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Req() req: Request,
  ) {
    return await this.postsService.getPagination(
      category,
      page,
      limit,
      req.cookies['language'] || 'korean',
    );
  }

  @ApiOperation({ summary: 'post 작성하기' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '첨부파일, 필수아님',
        },
        category: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        language: { type: 'string' },
        expiredDate: { type: 'Date', description: '필수 아님' },
        imagePath: {
          type: 'string',
          description:
            '/attachments 로 받은 이미지 url들을 전부 배열에 넣어서 JSON.stringify()로 바꾼 결과물, 글안에 이미지가 없는 경우 필수 아님',
        },
      },
    },
  })
  @ApiResponse({
    example: { message: '글이 작성되었습니다.' },
  })
  @Post() //완료
  @UseInterceptors(FilesInterceptor('file', 10, FileDiskOptions))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const author = 'admin'; //guard 생성시 삭제
    await this.postsService.create(files, createPostDto, author);
    return { message: '글이 작성되었습니다.' };
  }

  @ApiOperation({ summary: 'post 수정하기' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '첨부파일, 필수아님',
        },
        category: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        language: { type: 'string' },
        expiredDate: { type: 'Date', description: '필수 아님' },
        imagePath: {
          type: 'string',
          description:
            '/attachments 로 받은 이미지 url들을 전부 배열에 넣어서 JSON.stringify()로 바꾼 결과물, 글안에 이미지가 없는 경우 필수 아님',
        },
      },
    },
  })
  @ApiResponse({
    example: { message: '글이 수정되었습니다.' },
  })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    await this.postsService.update(id, updatePostDto);
    return { message: '글이 수정되었습니다.' };
  }

  @ApiOperation({ summary: 'post 삭제하기' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ example: { message: '글이 삭제되었습니다.' } })
  @Delete(':id') // 완료
  async remove(@Param('id') id: number) {
    await this.postsService.remove(id);
    return { message: '글이 삭제되었습니다.' };
  }
}
