import { ApplicationForm } from "../../application-form/entities/application-form.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity({name:'ApplicationAttachment'})
export class ApplicationAttachment {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    applicationId:number
    @Column({length:100})
    filename:string
    @Column({length:75})
    filetype:string
    @Column()
    fileSize:number
    @ManyToOne(()=>ApplicationForm,(application)=>application.id,{onDelete:'CASCADE'})
    @JoinColumn({name:'applicationId'})
    application:ApplicationForm
}
