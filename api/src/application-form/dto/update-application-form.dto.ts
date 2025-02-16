import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationFormDto } from './create-application-form.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateApplicationFormDto extends PartialType(
  CreateApplicationFormDto,
) {
  @IsString()
  @IsOptional()
  isDone?: string;
  @IsString()
  @IsOptional()
  deleteFilePath: string;
}
