import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";

@Entity({name:'attachment'})
export class Attachment{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    postId:number
    @Column()
    filename:string
    @Column()
    fileType:string
    @Column()
    fileSize:number
    @CreateDateColumn()
    createdAt:Date
    @ManyToOne(()=>Post,(post)=>post.id)
    @JoinColumn({name:'postId'})
    posts:Post
}