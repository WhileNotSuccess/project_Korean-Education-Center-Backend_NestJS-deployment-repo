import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, Matches } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({
    description: '성명',
    example: '문성윤',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '직책',
    example: '교수',
  })
  @IsString()
  position: string;

  @ApiProperty({
    description: '하위 직책',
    example: '센터장',
  })
  @IsString()
  subrole: string;

  @ApiProperty({
    description: '휴대폰 전화번호',
    example: '010-1234-5678',
  })
  @Matches(/^(010-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/, {
    message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678 또는 053-940-5635)',
  })
  phone: string;

  @ApiProperty({
    description: '이메일',
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '정렬 순서',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
