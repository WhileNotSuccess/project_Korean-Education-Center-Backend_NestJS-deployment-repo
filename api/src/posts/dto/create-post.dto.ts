import { IsArray, IsDate, IsOptional, IsString } from "class-validator"

export class CreatePostDto {
    @IsString()
    category:string
    @IsString()
    title:string
    @IsString()
    content:string
    @IsString()
    language:string
    @IsDate()
    @IsOptional()
    expiredAt:Date
    @IsArray()
    @IsString({each:true})
    @IsOptional()
    imagePath:string[]
}