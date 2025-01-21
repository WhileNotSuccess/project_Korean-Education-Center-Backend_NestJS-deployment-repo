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

    async create(files:Express.Multer.File[],postId:number){ // 외부에 트랜잭션 적용으로 해당 함수에는 미적용
        files.map(async file=>{
            await this.dataSource.manager.save(Attachment,
                {   
                    postId:postId,
                    filename:file.filename,
                    fileType:file.mimetype,
                    fileSize:file.size
                }
            )
        })
    }

    async getByPostId(postId:number){
        return await this.dataSource.manager.findBy(Attachment,{postId})
    }
    

}