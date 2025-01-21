import { IsDate, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    email:string

    @IsString()
    @IsOptional()
    password?:string

    @IsString()
    name:string

    @IsDate()
    @IsOptional()
    emailVerifiedAt?:Date

    @IsString()
    @IsOptional()
    googleId?:string
}
