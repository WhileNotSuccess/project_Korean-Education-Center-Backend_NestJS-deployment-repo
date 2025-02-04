import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApplicationFormDto } from './dto/create-application-form.dto';
import { UpdateApplicationFormDto } from './dto/update-application-form.dto';
import { transactional } from 'src/common/utils/transaction-helper';
import { DataSource } from 'typeorm';
import { ApplicationForm } from './entities/application-form.entity';
import { Attachment } from 'src/attachments/entities/attachment.entity';

@Injectable()
export class ApplicationFormService {
  constructor(private readonly dataSource:DataSource){}

  async create(
    createApplicationFormDto: CreateApplicationFormDto,
    file:Express.Multer.File,
    userId:number
  ) {
    await transactional(this.dataSource,async queryRunner=>{
      await queryRunner.manager.save(ApplicationForm,{
        ...createApplicationFormDto,
        filename:file.filename,
        filetype:file.mimetype,
        fileSize:file.size,
        isDone:false,
        userId
      })
    })
  }

  async findPagination(take:number,page:number,isDone:boolean) {
    const queryRunner= this.dataSource.createQueryBuilder().select('application').from(ApplicationForm,'application'
    ).take(take).skip((page-1)*take).orderBy('application.createdDate','ASC')
    if(!isDone){queryRunner.where({isDone})} // false면 isDone이 false인것만, true면 상관없이 전부 
    const [value,total]= await queryRunner.getManyAndCount()
    // const [value, total] = await this.dataSource.manager.findAndCount(ApplicationForm, {
    //       where:{ isDone },
    //       skip: (page - 1) * take,
    //       take,
    //       order: { createdDate: 'DESC' },
    //     });
    
    if(total==0){
      throw new BadRequestException(`미해결 입학신청이 존재하지 않습니다`)
    }
    const totalPage = Math.ceil(total / take);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      message: `입학신청의 ${page}번째 페이지를 불러왔습니다.`,
      data: value,
      currentPage: page,
      prevPage,
      nextPage,
      totalPage,
    };
  }

  async update(id: number, updateApplicationFormDto: UpdateApplicationFormDto,file:Express.Multer.File) {
    let updateObject={
      ...updateApplicationFormDto,
    }
    if(file){
      updateObject={
        ...updateObject,      
        filename:file.filename,
        filetype:file.mimetype,
        fileSize:file.size,
    } as ApplicationForm
  }
    await transactional(this.dataSource,async queryRunner=>{
      await queryRunner.manager.update(ApplicationForm,id,updateObject)
    })
  }

  async remove(id: number) {
    await transactional(this.dataSource,async queryRunner=>{
      await queryRunner.manager.delete(ApplicationForm,id)
    })
  }
}
