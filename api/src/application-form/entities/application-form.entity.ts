import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'ApplicationForm'})
export class ApplicationForm {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    userId:number
    @Column({length:100})
    filename:string
    @Column({length:20})
    course:string
    @CreateDateColumn()
    createdDate:Date
    @Column({length:75})
    filetype:string
    @Column()
    fileSize:number
    @Column()
    isDone:boolean
}
