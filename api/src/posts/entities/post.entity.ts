import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Attachment } from "../../attachments/entities/attachment.entity";

@Entity({name:'posts'})
export class Post {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    title:string
    @Column({type:'longtext'})
    content:string
    @Column()
    author:string
    @Column()
    category:string
    @CreateDateColumn()
    createdAt:Date
    @UpdateDateColumn()
    updatedAt:Date
    @Column()
    language:string
    @Column({nullable:true})
    expiredAt:Date
    @OneToMany(()=>Attachment,attach=>attach.postId)
    attach:Attachment[]
}
