import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({
    description: '성명',
    example: '문성윤',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '직책',
    example: '강사',
  })
  @IsString()
  position: string;

  @ApiProperty({
    description: '휴대폰 전화번호',
    example: '010-1234-5678',
  })
  @Matches(/^010-\d{4}-\d{4}$/, {
    message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)',
  })
  phone: string;

  @ApiProperty({
    description: '이메일',
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;
}
