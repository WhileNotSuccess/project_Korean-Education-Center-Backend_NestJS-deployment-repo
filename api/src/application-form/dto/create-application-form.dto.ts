import { IsNumber, IsString } from "class-validator";

export class CreateApplicationFormDto {
    @IsNumber()
    course:number
    @IsString()
    phoneNumber:string
}
