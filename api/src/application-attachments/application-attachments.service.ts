import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Multer } from 'multer';
import { transactional } from 'src/common/utils/transaction-helper';
import { DataSource, QueryRunner } from 'typeorm';
import { ApplicationAttachment } from './entities/application-attachment.entity';
import * as fs from 'fs';
import { ApplicationForm } from 'src/application-form/entities/application-form.entity';
import checkOwnership from 'src/common/utils/checkOwnership';

@Injectable()
export class ApplicationAttachmentsService {
  constructor(private readonly datasource: DataSource) {}

  async createByApplication(
    files: Express.Multer.File[],
    queryRunner: QueryRunner,
    applicationId: number,
  ) {
    for (let file of files) {
      await queryRunner.manager.save(ApplicationAttachment, {
        fileSize: file.size,
        filename: file.filename,
        filetype: file.mimetype,
        applicationId,
      });
    }
  }

  async findByApplication(applicationId: number, user) {
    const auth = await checkOwnership(
      user,
      ApplicationForm,
      applicationId,
      this.datasource,
    );
    return await this.datasource.manager.findBy(ApplicationAttachment, {
      applicationId,
    });
  }

  async deleteOne(id: number, user) {
    const target = await this.datasource.manager.findOneBy(
      ApplicationAttachment,
      { id },
    );

    const auth = await checkOwnership(
      user,
      ApplicationForm,
      target.applicationId,
      this.datasource,
    );
    await transactional(this.datasource, async (queryRunner) => {
      await queryRunner.manager.delete(ApplicationAttachment, id);
    });
  }

  async deleteByApplication(filenames: string[], queryRunner: QueryRunner) {
    filenames.forEach(async (filename) => {
      await queryRunner.manager.delete(ApplicationAttachment, { filename });
      fs.unlink(filename, (e) => console.log(e));
    });
  }
}
