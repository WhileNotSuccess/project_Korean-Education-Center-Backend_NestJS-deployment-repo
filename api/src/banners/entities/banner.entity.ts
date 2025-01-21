import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'Banner'})
export class Banner {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    image:string // 이미지 url
    @Column()
    language:string
    @Column()
    expiredAt:Date
    @Column()
    url:string // 이미지 클릭시 이동할 url
}
