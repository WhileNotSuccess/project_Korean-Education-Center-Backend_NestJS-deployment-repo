import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  category: string;
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  language: string;
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isSecret?: boolean = false;

  @IsOptional()
  @IsString()
  writerName?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
