import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @ApiProperty({
    name: 'name',
    description: '강좌명',
    example: '강좌1',
  })
  name: string;
}
