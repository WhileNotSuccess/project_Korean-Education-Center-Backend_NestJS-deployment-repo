import { ApplicationAttachment } from "../..//application-attachments/entities/application-attachment.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'ApplicationForm'})
export class ApplicationForm {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    userId:number
    @Column({length:20})
    course:string
    @CreateDateColumn()
    createdDate:Date
    @Column({default:false})
    isDone:boolean
    @OneToMany(()=>ApplicationAttachment,(attachment)=>attachment.applicationId,{onDelete:'CASCADE'})
    applicationAttachment:ApplicationAttachment[]
}
