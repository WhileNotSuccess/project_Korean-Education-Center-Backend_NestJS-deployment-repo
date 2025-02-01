import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Attachment } from "./entities/attachment.entity";
import * as fs from 'fs'
import * as path from 'path'
import { transactional } from "src/common/utils/transaction-helper";

@Injectable()
export class AttachmentsService{
    constructor(
        private readonly dataSource:DataSource

    ){}

    async create(files:Express.Multer.File[],postId:number){
        transactional(this.dataSource,async queryRunner=>{
            files.map(async file=>{
                await queryRunner.manager.save(Attachment,
                    {   
                        postId:postId,
                        filename:file.filename,
                        fileType:file.mimetype,
                        fileSize:file.size
                    }
                )
            })
        })
    }

    async getByPostId(postId:number){
        const files=(await this.dataSource.manager.findBy(Attachment,{postId}))
        return files
    }

    async getDownload(id:number){
        const attachment=await this.dataSource.manager.findOneBy(Attachment,{id})
        return `/app/uploads/attachments/${attachment.filename}`
    }
    

}