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
    @Column({length:20})
    category:string
    @CreateDateColumn()
    createdDate:Date
    @UpdateDateColumn()
    updatedDate:Date
    @Column({length:10})
    language:string
    @Column({nullable:true})
    expiredDate:Date
    @OneToMany(()=>Attachment,attach=>attach.postId,{onDelete:'CASCADE'})
    attach:Attachment[]
}
