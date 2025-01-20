import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Attachment } from "./entities/attachment.entity";
import * as fs from 'fs'

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
    
    async getFile(id:number,path:string){
        const file=await this.dataSource.manager.findOneBy(Attachment,{id})
        let exists= fs.existsSync(`${path}/${file.filename}`)
        if(!exists){throw new BadRequestException('파일이 존재하지 않습니다.')}
        return `${path}/${file.filename}`
    }
}