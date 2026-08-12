import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { transactional } from 'src/common/utils/transaction-helper';
import * as levenshtein from 'fast-levenshtein';
import { findFiles } from 'src/common/fileArrayFind';
import { PostImages } from 'src/attachments/entities/post-images.entity';
import { User } from 'src/users/entities/user.entity';
import checkOwnership from 'src/common/utils/checkOwnership';

@Injectable()
export class PostsService {
  constructor(
    private readonly datasource: DataSource,
    private readonly attachmentService: AttachmentsService,
  ) {}

  async getOne(
    find: number | string,
    language: string,
    user?: { id: number; email: string },
    inputPassword?: string,
  ) {
    let post: Post;

    switch (
      typeof find //find의 타입 확인해서 string(안내글)과 number(게시글) 분류
    ) {
      case 'string': //안내글 찾을 경우
        post = await this.datasource.manager
          .createQueryBuilder()
          .select('posts')
          .from(Post, 'posts') //Post테이블에서 정보 다 받아오고
          .where('category LIKE :category', { category: find })
          .andWhere('language LIKE :language', { language }) // 그때 받는 조건 2개
          .orderBy('updatedDate', 'DESC')
          .getOne(); // 최신순 정렬로 하나만 받아옴
        return post;

      case 'number': //게시글 찾을 경우
        post = await this.datasource.manager.findOne(Post, {
          where: { id: find },
          relations: ['user'],
        });
        if (!post) return null;
        if (post.isSecret) {
          const isAdmin = user && user.email === process.env.ADMIN_EMAIL;
          if (!isAdmin) {
            const isAuthor = user && post.userId !== null && post.userId !== undefined && user.id === post.userId;
            if (!isAuthor) {
              if (!inputPassword || post.password !== inputPassword) {
                throw new ForbiddenException('비밀글입니다.');
              }
            }
          }
        }
        const res = { ...post, user: '', author: post.user ? post.user.name : post.writerName };
        return res;
    }
  }

  async getOneForMain(find: string, language: string) {
    const post = await this.datasource.manager
      .createQueryBuilder()
      .select('posts')
      .from(Post, 'posts') //Post테이블에서 정보 다 받아오고
      .where('category LIKE :category', { category: find })
      .andWhere('language LIKE :language', { language }) // 그때 받는 조건 2개
      .orderBy('updatedDate', 'DESC')
      .getOne(); // 최신순 정렬로 하나만 받아옴
    const attachment = await this.attachmentService.getByPostId(post.id);
    const image = await this.attachmentService.getImageByPostId(post.id);

    return { ...post, filename: attachment[0].filename, image };
  }

  async getOverview(language: string) {
    const post = await this.datasource.manager
      .createQueryBuilder()
      .select('posts')
      .from(Post, 'posts') //Post테이블에서 정보 다 받아오고
      .where('category LIKE :category', { category: 'korean-sample' })
      .andWhere('language LIKE :language', { language })
      .orderBy('updatedDate', 'DESC')
      .getOne(); // 최신순 정렬로 하나만 받아옴

    const match = post.content.match(/<table[\s\S]*?<\/table>/i);
    return match[0];
  }
  async getPagination(
    category: string,
    page: number,
    take: number,
    language: string,
  ) {
    // 카테고리, 현재 페이지, 가져올 글 개수
    const whereCondition: any = { category };
    if (category === 'qna') {
      whereCondition.language = 'korean';
    } else {
      whereCondition.language = language;
    }

    const [value, total] = await this.datasource.manager.findAndCount(Post, {
      where: whereCondition,
      relations: ['user'],
      skip: (page - 1) * take,
      take,
      order: { isPinned: 'DESC', createdDate: 'DESC' },
    });

    if (total == 0) {
      return {
        message: `${category}글이 존재하지 않습니다.`,
        data: [],
        currentPage: 1,
        prevPage: null,
        nextPage: null,
        totalPage: 1,
      };
    }

    const totalPage = Math.ceil(total / take);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      message: `${category}의 ${page}번째 페이지를 불러왔습니다.`,
      data: value.map((item) => {
        let authorName = item.user ? item.user.name : item.writerName;
        if (category === 'qna') {
          authorName = authorName ? maskName(authorName) : '***';
        }
        return { ...item, user: {}, author: authorName };
      }),
      currentPage: page,
      prevPage,
      nextPage,
      totalPage,
    };
  }

  async create(
    createPostDto: CreatePostDto,
    id: number,
    files: Express.Multer.File[],
  ) {
    const regex = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
    const createFilenames: string[] = []; // 테이블에 저장할 이미지 파일의 이름을 저장
    let match;
    if ((match = regex.exec(createPostDto.content)) !== null) {
      // 정규식으로 작성할 글의 content에서 src속성의 이미지파일 주소를 다 찾아옴
      createFilenames.push(match[1].replace(`${process.env.BACKEND_URL}/`, '')); // 백엔드 주소를 없애고 filename에 저장
    }
    await transactional<void>(this.datasource, async (queryRunner) => {
      const post = await queryRunner.manager.save(Post, {
        ...createPostDto,
        isPinned:
          createPostDto.category === 'notice' &&
          createPostDto.isPinned === true,
        userId: id || null,
        language: createPostDto.category === 'qna' ? 'korean' : createPostDto.language,
      }); // post 테이블 작성

      if (createFilenames) {
        //저장할 이미지 파일이 있는 경우
        const array = findFiles(createFilenames); // findFiles로 이미지의 데이터를 받아와서
        await this.attachmentService.createImage(array, post.id, queryRunner); // 테이블에 인스턴스 생성
      }
      if (!(files.length == 0)) {
        await this.attachmentService.createAttachment(
          files,
          post.id,
          queryRunner,
        ); //첨부파일 저장
      }
    });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    files: Express.Multer.File[],
    user,
    password?: string,
  ) {
    const post = await this.datasource.manager.findOne(Post, { where: { id } });
    if (!post) throw new NotFoundException('게시글이 존재하지 않습니다.');

    const isAdmin = user && user.email === process.env.ADMIN_EMAIL;
    if (!isAdmin) {
      if (post.userId === null || post.userId === undefined) {
        if (!post.password || post.password !== password) {
          throw new ForbiddenException('권한이 없거나 비밀번호가 틀렸습니다.');
        }
      } else {
        await checkOwnership(user, Post, id, this.datasource);
      }
    }

    const oldPostImages = await this.datasource.manager.find(PostImages, {
      where: { postId: id },
      select: ['filename'],
    });

    const oldImageList: string[] = []; // 기존에 게시글의 이미지들
    oldPostImages.forEach((image) => {
      oldImageList.push(image.filename);
    }); // 찾아온 파일 이름만 빼서 oldSrcList에 추가

    const regex: RegExp = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
    const newImageList: string[] = []; // 새롭게 수정된 게시글에 있는 이미지 경로들
    let match;
    while ((match = regex.exec(updatePostDto.content)) !== null) {
      newImageList.push(match[1].replace(`${process.env.BACKEND_URL}/`, ''));
      //src 속성에 있던 백엔드 주소를 삭제 해서 파일이름만 저장
    }
    // oldImageList - newImageList 기존에 있었는데 제거된 이미지
    const deleteTarget: string[] = oldImageList.filter(
      (x) => !newImageList.includes(x),
    );
    // newImageList - OldImageList 기존에 없는 새로 추가된 이미지
    const createTarget: string[] = newImageList.filter(
      (x) => !oldImageList.includes(x),
    );
    await transactional<void>(this.datasource, async (queryRunner) => {
      if (deleteTarget) {
        // 삭제할 이미지
        await this.attachmentService.deleteOldImage(deleteTarget, queryRunner);
      }
      if (createTarget) {
        //생성할 이미지
        const createArray = findFiles(createTarget);
        await this.attachmentService.createImage(createArray, id, queryRunner);
      }

      if (updatePostDto.deleteFilePath) {
        //삭제할 파일
        const deletePath = JSON.parse(updatePostDto.deleteFilePath);
        await this.attachmentService.deleteFileAndAttachments(
          deletePath,
          queryRunner,
        );
      }
      if (!(files.length == 0)) {
        //생성할 파일
        await this.attachmentService.createAttachment(files, id, queryRunner);
      }
      const { deleteFilePath, ...newPost } = updatePostDto;
      console.log('삭제될 파일: ', deleteFilePath);
      const existing = await queryRunner.manager.findOne(Post, {
        where: { id },
        select: ['category', 'isPinned'],
      });
      const category = newPost.category ?? existing?.category;
      // 입력이 없으면 false, true로 명시될 때만 고정
      newPost.isPinned =
          category === 'notice' && newPost.isPinned === true;
      if (category === 'qna') {
        newPost.language = 'korean';
      }
      await queryRunner.manager.update(Post, id, newPost);
    });
  }

  async remove(id: number, user, password?: string) {
    const post = await this.datasource.manager.findOne(Post, { where: { id } });
    if (!post) throw new NotFoundException('게시글이 존재하지 않습니다.');

    const isAdmin = user && user.email === process.env.ADMIN_EMAIL;
    if (!isAdmin) {
      if (post.userId === null || post.userId === undefined) {
        if (!post.password || post.password !== password) {
          throw new ForbiddenException('권한이 없거나 비밀번호가 틀렸습니다.');
        }
      } else {
        await checkOwnership(user, Post, id, this.datasource);
      }
    }
    await transactional<void>(this.datasource, async (queryRunner) => {
      await queryRunner.manager.delete(Post, id);
    });
  }

  async search(
    category: string,
    page: number,
    limit: number,
    language: string,
    title?: string,
    author?: string,
    content?: string,
  ) {
    const queryBuilder = this.datasource.manager.createQueryBuilder();
    queryBuilder
      .from(Post, 'post')
      .leftJoin(User, 'user', 'post.userId = user.id');
    queryBuilder
      .where('category = :category', { category });
    if (category === 'qna') {
      queryBuilder.andWhere('language = :language', { language: 'korean' });
    } else {
      queryBuilder.andWhere('language = :language', { language });
    }
    queryBuilder.select(
      'post.id AS id , post.title AS title , post.content AS content , post.category AS category , post.createdDate AS createdDate , post.updatedDate AS updatedDate , post.language AS language, post.isPinned AS isPinned, user.name AS author',
    );
    let results = await queryBuilder.getRawMany();

    if (title) {
      results = results
        .map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          language: post.language,
          createdDate: post.createdDate,
          updatedDate: post.updatedDate,
          author: post.author,
          isPinned: !!post.isPinned,
          include: (post.title as string).indexOf(title) !== -1,
          distance: levenshtein.get(post.title, title),
        }))
        .filter((post) => post.include)
        .sort(this.sort);
    }
    if (author) {
      results = results
        .map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          language: post.language,
          createdDate: post.createdDate,
          updatedDate: post.updatedDate,
          author: post.author,
          isPinned: !!post.isPinned,
          include: (post.author as string).indexOf(author) !== -1,
          distance: levenshtein.get(post.author, author),
        }))
        .filter((post) => post.include)
        .sort(this.sort);
    }
    if (content) {
      results = results
        .map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          language: post.language,
          createdDate: post.createdDate,
          updatedDate: post.updatedDate,
          author: post.author,
          isPinned: !!post.isPinned,
          include: (post.content as string).indexOf(content) !== -1,
          distance: levenshtein.get(post.content, content),
        }))
        .filter((post) => post.include)
        .sort(this.sort);
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
    if (!!a.isPinned !== !!b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    if ((a.include && b.include) || (!a.include && !b.include)) {
      if (a.distance === b.distance) {
        return a.id - b.id;
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

  async slide(language: string) {
    const posts = await this.datasource.manager.find(Post, {
      where: { category: 'news', language: language },
      take: 10,
      order: { updatedDate: 'DESC' },
    });
    const regex: RegExp = /<img[^>]+src=["']?([^"'\s>]+)["'\s>]/g;
    const slideList = []; // 새롭게 수정된 게시글에 있는 이미지 경로들
    for (let index = 0; index < posts.length; index++) {
      const element = posts[index];

      // 정규식 lastIndex 초기화
      regex.lastIndex = 0;

      const match = regex.exec(element.content);

      if (match) {
        slideList.push({
          title: element.title,
          image: match[1].replace(`${process.env.BACKEND_URL}/`, ''),
          id: element.id,
        });
      }
    }

    return slideList;
  }

  async answer(id: number, answer: string) {
    await this.datasource.manager.update(Post, id, {
      answer,
      answerDate: new Date(),
    });
  }

  async convertToFaq(id: number) {
    const qna = await this.datasource.manager.findOne(Post, {
      where: { id },
    });
    if (!qna) throw new Error('게시글을 찾을 수 없습니다.');

    let combinedContent = qna.content;
    if (qna.answer) {
      combinedContent = `
        <p><strong>Q. ${qna.title}</strong></p>
        <div style="margin-top: 10px; margin-bottom: 20px;">
          ${qna.content}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>A.</strong></p>
        <div style="margin-top: 10px;">
          ${qna.answer}
        </div>
      `;
    }

    const adminUser = await this.datasource.manager.findOne(User, {
      where: { email: process.env.ADMIN_EMAIL },
    });
    const adminUserId = adminUser ? adminUser.id : null;

    const writerName = '관리자';
    
    await this.datasource.manager.save(Post, {
      title: qna.title,
      content: combinedContent,
      category: 'faq',
      language: qna.language,
      userId: adminUserId,
      writerName: writerName,
    });
  }
}

function maskName(name: string): string {
  if (!name) return '***';
  const len = name.length;
  if (len <= 1) return '*';
  if (len === 2) return name[0] + '*';
  return name[0] + '*'.repeat(len - 2) + name[len - 1];
}
