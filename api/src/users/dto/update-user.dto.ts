import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: '유저가 변경하고자 하는 이름',
    example: '문성윤',
  })
  @IsString()
  name: string;
}
