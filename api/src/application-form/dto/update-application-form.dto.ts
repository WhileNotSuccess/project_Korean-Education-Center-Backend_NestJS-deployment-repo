import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationFormDto } from './create-application-form.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateApplicationFormDto extends PartialType(CreateApplicationFormDto) {
    @IsBoolean()
    @IsOptional()
    isDone?:boolean
}
