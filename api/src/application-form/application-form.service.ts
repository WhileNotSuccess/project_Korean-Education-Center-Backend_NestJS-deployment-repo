import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApplicationFormDto } from './dto/create-application-form.dto';
import { UpdateApplicationFormDto } from './dto/update-application-form.dto';
import { transactional } from 'src/common/utils/transaction-helper';
import { DataSource } from 'typeorm';
import { ApplicationForm } from './entities/application-form.entity';
import { ApplicationAttachmentsService } from 'src/application-attachments/application-attachments.service';


@Injectable()
export class ApplicationFormService {
  constructor(
    private readonly dataSource:DataSource,
    private readonly applicationAttachment:ApplicationAttachmentsService
  ){}

  async create(
    createApplicationFormDto: CreateApplicationFormDto,
    files:Express.Multer.File[],
    userId:number
  ) {
    await transactional(this.dataSource,async queryRunner=>{
      const applicationId=(await queryRunner.manager.save(ApplicationForm,{...createApplicationFormDto,userId})).id
      // 저장하고 id를 받아서 applicationId로 저장하기위해 보냄
      await this.applicationAttachment.createByApplication(files,queryRunner,applicationId)
    })
  }

  async findPagination(take:number,page:number,isDone:boolean) {
    const queryRunner= this.dataSource.createQueryBuilder()
    .select('application').from(ApplicationForm,'application')
    .take(take).skip((page-1)*take).orderBy('application.createdDate','ASC')
    
    if(!isDone){queryRunner.where({isDone})} // false면 isDone이 false인것만, true면 상관없이 전부

    const [value,total]= await queryRunner.getManyAndCount()

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
  
  async update(id: number, updateApplicationFormDto: UpdateApplicationFormDto,files:Express.Multer.File[]) {

    await transactional(this.dataSource,async queryRunner=>{

      if(updateApplicationFormDto.deleteFilePath){
        const deleteFiles=JSON.parse(updateApplicationFormDto.deleteFilePath)
        await this.applicationAttachment.deleteByApplication(deleteFiles,queryRunner)
      }
      if(!(files.length==0)){
        await this.applicationAttachment.createByApplication(files,queryRunner,id)
      }
      const {deleteFilePath, ...array}=updateApplicationFormDto
      await queryRunner.manager.update(ApplicationForm,id,array)
    })
  }
 
  async remove(id: number) {
    await transactional(this.dataSource,async queryRunner=>{
      await queryRunner.manager.delete(ApplicationForm,id)
    })
  }
}
