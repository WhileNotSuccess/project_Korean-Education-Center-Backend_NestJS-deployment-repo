import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  category: string;
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  language: string;
  @IsDate()
  @IsOptional()
  expiredDate: Date;
  @IsString()
  @IsOptional()
  deleteFilePath: string;
}
