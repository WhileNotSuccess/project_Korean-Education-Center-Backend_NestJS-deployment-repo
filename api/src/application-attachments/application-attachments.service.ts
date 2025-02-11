import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { CreateApplicationAttachmentDto } from './dto/create-application-attachment.dto';
import { UpdateApplicationAttachmentDto } from './dto/update-application-attachment.dto';
import { transactional } from 'src/common/utils/transaction-helper';
import { DataSource, QueryRunner } from 'typeorm';
import { ApplicationAttachment } from './entities/application-attachment.entity';
import { error } from 'console';

@Injectable()
export class ApplicationAttachmentsService {
  constructor(private readonly datasource:DataSource){}

  async createByApplication(files:Express.Multer.File[],queryRunner:QueryRunner,applicationId:number){
    for(let file of files){
      await queryRunner.manager.save(ApplicationAttachment,{
        fileSize:file.size,
        filename:file.filename,
        filetype:file.mimetype,
        applicationId
      })
    }
  }

  async findByApplication(applicationId:number){
    return await this.datasource.manager.findBy(ApplicationAttachment,{applicationId})
  }
  
  async deleteOne(id:number){
    transactional(this.datasource,async queryRunner=>{
      await queryRunner.manager.delete(ApplicationAttachment,id)
    })
  }
  async deleteByApplication(ids:number[],queryRunner:QueryRunner){
    ids.forEach(async id=>{
      await queryRunner.manager.delete(ApplicationAttachment,{id})
    })
  }

  async updateFile(id:number, file:Express.Multer.File){
    transactional(this.datasource,async queryRunner=>{
      await queryRunner.manager.update(ApplicationAttachment,id,{filename:file.filename,fileSize:file.size,filetype:file.mimetype})
    })
  }
}
