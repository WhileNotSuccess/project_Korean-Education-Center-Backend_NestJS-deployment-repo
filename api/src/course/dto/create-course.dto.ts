import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @ApiProperty({
    name: 'Korean',
    description: '강좌명',
    example: '강좌1',
  })
  korean: string;
  @IsString()
  @ApiProperty({
    name: 'Japanese',
    description: '講座名',
    example: '講座1',
  })
  japanese: string;
  @IsString()
  @ApiProperty({
    name: 'English',
    description: 'CourseName',
    example: 'Course1',
  })
  english: string;
}
