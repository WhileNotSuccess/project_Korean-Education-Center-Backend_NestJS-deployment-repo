import { IsDate, IsString } from "class-validator";

export class CreateBannerDto {
    @IsString()
    language:string
    @IsDate()
    expiredAt:Date
    @IsString()
    url:string
}
