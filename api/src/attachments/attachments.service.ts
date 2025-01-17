import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Attachment } from "./entities/attachment.entity";

@Injectable()
export class AttachmentsService{
    constructor(
        private readonly dataSource:DataSource

    ){}

    async create(files:Express.Multer.File[],postId:number){
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
    async get(postId:number){
        return await this.dataSource.manager.findBy(Attachment,{postId})
    }

    
    async getFile(id:number){
        return await this.dataSource.manager.findOneBy(Attachment,{id})
    }
}