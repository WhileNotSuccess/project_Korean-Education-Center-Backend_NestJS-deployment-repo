import { IsString } from "class-validator";

export class CreateApplicationFormDto {
    @IsString()
    course:string
}
