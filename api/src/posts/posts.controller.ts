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
  DefaultValuePipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly attachmentService: AttachmentsService,
  ) {}
  @ApiOperation({
    summary: '메인에서 사용, 모집요강 학사일정을 받아올 수 있다.',
  })
  @ApiResponse({
    example: {
      message: '학사일정을 불러왔습니다.',
      content: '<table>hello</table>',
    },
  })
  @Get('main/overview')
  async mainOverview(@Req() req) {
    const overview = await this.postsService.getOverview(
      req.cookies['language'] || 'korean',
    );

    return {
      message: '학사일정을 불러왔습니다.',
      content: overview,
    };
  }
  @ApiOperation({
    summary:
      '메인에서 사용, 모집요강 파일 이름과 사진, 입학신청서 파일 이름과 사진을 받아 올 수 있다.',
  })
  @ApiResponse({
    example: {
      message: '모집요강과 입학신청서를 불러왔습니다.',
      guidelinesForApplicantsFileName: '20250224-161403_tinymce_5.10.5_dev.pdf',
      guidelinesForApplicantsImageName: '20250224-161403.jpg',
      applicationFileName: '20250224-161403_tinymce_5.10.5_dev.pdf',
      applicationImageName: '20250224-161403_tinymce_5.10.5_dev.jpg',
      guideBookFileName: '20250224-161403_tinymce_5.10.5_dev.pdf',
      guideBookImageName: '20250224-161403_tinymce_5.10.5_dev.jpg',
    },
  })
  @Get('main/applicants')
  async mainApplicants(@Req() req) {
    const guidelinesForApplicants = await this.postsService.getOneForMain(
      'guidelinesForApplicants',
      req.cookies['language'] || 'korean',
    );
    const applicants = await this.postsService.getOneForMain(
      'applicants',
      req.cookies['language'] || 'korean',
    );
    const guideBook = await this.postsService.getOneForMain(
      'guideBook',
      req.cookies['language'] || 'korean',
    );
    return {
      message: '모집요강과 입학신청서를 불러왔습니다.',
      guidelinesForApplicantsFileName: guidelinesForApplicants.filename,
      guidelinesForApplicantsImageName: guidelinesForApplicants.image,
      applicationFileName: applicants.filename,
      applicationImageName: applicants.image,
      guideBookFileName: guideBook.filename,
      guideBookImageName: guideBook.image,
    };
  }

  @ApiOperation({
    summary: '검색하기, 제목/내용/작성자 중 하나를 검색할 수 있다.',
  })
  @ApiQuery({
    name: 'title',
    example: '공지사항',
    description: '제목 검색을 할 경우 입력',
    required: false,
  })
  @ApiQuery({
    name: 'content',
    example: '내용',
    description: '게시글 내부 내용을 검색할 경우 입력',
    required: false,
  })
  @ApiQuery({
    name: 'category',
    example: 'notice',
    description:
      '카테고리, 필수임, 모든 카테고리에서 검색하는 기능은 지원하지 않음음',
    required: false,
  })
  @ApiQuery({
    name: 'author',
    example: 'admin',
    description: '작성자를 검색하는 경우 입력',
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
    @Req() req,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('category') category: string,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('content') content?: string,
  ) {
    const language = req.cookies['language'] || 'korean';
    const filter = { title, author, content };
    const selectedFilters = Object.values(filter).filter((value) => value);
    if (selectedFilters.length !== 1) {
      throw new BadRequestException(
        'title, author, content 중 하나만 선택해야 합니다.',
      );
    }
    return await this.postsService.search(
      category,
      page,
      limit,
      language,
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
      },
      files: [
        {
          id: 1,
          postId: 1,
          filename: '20250204-154557_인천대학교 한국어 교육센터 메뉴 구성.hwpx',
          fileType: 'application/octet-stream',
          fileSize: 20234,
        },
      ],
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
      return {
        message: `${find}${typeof find === 'string' ? ' 안내글이 없습니다.' : '번 게시글이 없습니다.'}`,
        data: {},
        files: [],
      };
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
        files: {
          type: 'string',
          format: 'binary',
          description: '글의 첨부파일 전부, 없을 경우 필수 아님',
        },
        category: { type: 'string', description: '글의 카테고리, 필수' },
        title: { type: 'string', description: '글의 제목, 필수' },
        content: { type: 'string', description: '글의 내용, 필수' },
        language: { type: 'string', description: '글의 언어, 필수' },
      },
    },
  })
  @ApiResponse({
    example: { message: '글이 작성되었습니다.' },
  })
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, FileDiskOptions))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    if (
      !(
        createPostDto.category == 'review' || createPostDto.category == 'faq'
      ) &&
      req.user.email !== process.env.ADMIN_EMAIL
    ) {
      throw new UnauthorizedException('관리자만 작성가능합니다.');
    }

    await this.postsService.create(createPostDto, req.user.id, files);
    return { message: '글이 작성되었습니다.' };
  }

  @ApiOperation({ summary: 'post 수정하기' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
          description: '새로 추가하는 첨부파일',
        },
        category: { type: 'string', description: '글의 카테고리, 필수 아님' },
        title: { type: 'string', description: '글의 제목, 필수 아님' },
        content: { type: 'string', description: '글의 내용, 필수 아님' },
        language: { type: 'string', description: '글의 언어, 필수 아님' },
        deleteFilePath: {
          type: 'string',
          description:
            '/attachments 로 받은 파일 중 삭제할 파일의 url들을 전부 배열에 넣어서 JSON.stringify()로 바꾼 결과물, 삭제할 첨부파일이 없는 경우 필수 아님',
        },
      },
    },
  })
  @ApiResponse({
    example: { message: '글이 수정되었습니다.' },
  })
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 10, FileDiskOptions))
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    await this.postsService.update(id, updatePostDto, files, req.user);
    return { message: '글이 수정되었습니다.' };
  }

  @ApiOperation({ summary: 'post 삭제하기' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ example: { message: '글이 삭제되었습니다.' } })
  @UseGuards(AuthGuard)
  @Delete(':id') // 완료
  async remove(@Param('id') id: number, @Req() req) {
    await this.postsService.remove(id, req.user);
    return { message: '글이 삭제되었습니다.' };
  }

  @ApiOperation({ summary: '메인화면 카드 슬라이드' })
  @ApiResponse({
    example: {
      message: '정보를 성공적으로 가져왔습니다.',
      data: [
        {
          id: 1,
          image: '212514684-hello.png',
          title: '제목입니다.',
        },
      ],
    },
  })
  @Get('/card/slide')
  async getSlide(@Req() req) {
    const language = req.cookies['language'] || 'korean';

    return {
      message: '정보를 성공적으로 가져왔습니다.',
      data: await this.postsService.slide(language),
    };
  }
}
