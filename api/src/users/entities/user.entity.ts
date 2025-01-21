import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column({nullable:true})
    password:string

    @Column({unique:true})
    email:string

    @Column({nullable:true})
    googleId:string

    @Column({nullable:true})
    emailVerifiedAt:Date

    @Column()
    signUpVerifyToken:string
}
