import { IsString } from "class-validator";
import { Language } from "../../common/language.enum";

export class CreateApplicationFormDto {
    @IsString()
    course:Language
    @IsString()
    phoneNumber:string
}
