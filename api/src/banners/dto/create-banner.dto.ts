import { IsDate, IsString } from "class-validator";

export class CreateBannerDto {
    @IsString()
    language:string
    @IsDate()
    expiredDate:Date
    @IsString()
    url:string
}
