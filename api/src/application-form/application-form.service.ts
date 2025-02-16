import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApplicationFormDto } from './dto/create-application-form.dto';
import { UpdateApplicationFormDto } from './dto/update-application-form.dto';
import { transactional } from 'src/common/utils/transaction-helper';
import { DataSource } from 'typeorm';
import { ApplicationForm } from './entities/application-form.entity';
import { ApplicationAttachmentsService } from 'src/application-attachments/application-attachments.service';
import { ApplicationAttachment } from 'src/application-attachments/entities/application-attachment.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ApplicationFormService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly applicationAttachment: ApplicationAttachmentsService,
  ) {}

  async create(
    createApplicationFormDto: CreateApplicationFormDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    await transactional(this.dataSource, async (queryRunner) => {
      const applicationId = (
        await queryRunner.manager.save(ApplicationForm, {
          ...createApplicationFormDto,
          userId,
        })
      ).id;
      // 저장하고 id를 받아서 applicationId로 저장하기위해 보냄
      await this.applicationAttachment.createByApplication(
        files,
        queryRunner,
        applicationId,
      );
    });
  }

  async findPagination(take: number, page: number, isDone: boolean) {
    const queryRunner = this.dataSource
      .getRepository(ApplicationForm)
      .createQueryBuilder('form')
      .leftJoin(
        ApplicationAttachment,
        'attachment',
        'attachment.applicationId = form.id',
      )
      .leftJoin(User, 'user', 'user.id = form.userId')
      .select([
        'form.id AS id',
        'form.userId AS userId',
        'form.course AS course',
        'form.createdDate AS createdDate',
        'form.isDone AS isDone',
      ])
      .addSelect(
        `
        COALESCE(
          CONCAT('[', 
            GROUP_CONCAT(
              JSON_OBJECT(
                'id', attachment.id,
                'applicationId', attachment.applicationId,
                'filename', attachment.filename,
                'fileSize', attachment.fileSize,
                'filetype', attachment.filetype
              ) SEPARATOR ','
            ), 
          ']'), '[]'
        ) AS attachments
      `,
      )
      .addSelect(['user.name AS userName'])
      .groupBy('form.id')
      .take(take)
      .skip((page - 1) * take)
      .orderBy('form.createdDate', 'ASC');

    if (!isDone) {
      queryRunner.where('form.isDone = :isDone', { isDone: false });
    }

    const rawData = await queryRunner.getRawMany(); // getRawAndEntities() 대신 사용

    // MySQL의 `GROUP_CONCAT()`은 문자열로 반환되므로, JSON으로 변환
    const formattedData = rawData.map((row) => ({
      ...row,
      attachments: JSON.parse(row.attachments), // 문자열을 JSON 배열로 변환
    }));

    if (formattedData.length === 0) {
      return { message: `미해결 입학신청이 존재하지 않습니다` };
    }

    const total = formattedData.length;
    const totalPage = Math.ceil(total / take);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      message: `입학신청의 ${page}번째 페이지를 불러왔습니다.`,
      data: formattedData,
      currentPage: page,
      prevPage,
      nextPage,
      totalPage,
    };
  }

  async update(
    id: number,
    updateApplicationFormDto: UpdateApplicationFormDto,
    files: Express.Multer.File[],
  ) {
    await transactional(this.dataSource, async (queryRunner) => {
      if (updateApplicationFormDto.deleteFilePath) {
        const deleteFiles = JSON.parse(updateApplicationFormDto.deleteFilePath);
        await this.applicationAttachment.deleteByApplication(
          deleteFiles,
          queryRunner,
        );
      }
      if (!(files.length == 0)) {
        await this.applicationAttachment.createByApplication(
          files,
          queryRunner,
          id,
        );
      }
      const { deleteFilePath, ...array } = updateApplicationFormDto;
      await queryRunner.manager.update(ApplicationForm, id, {
        ...array,
        isDone: array.isDone === 'false' ? false : true,
      });
    });
  }

  async remove(id: number) {
    await transactional(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.delete(ApplicationForm, id);
    });
  }
}
