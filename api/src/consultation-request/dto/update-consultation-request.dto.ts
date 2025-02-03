import { ApiProperty } from '@nestjs/swagger';

import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  Matches,
} from 'class-validator';

export class UpdateConsultationRequestDto {
  @ApiProperty({
    description: '이메일',
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty({
    description: '상담신청일자',
  })
  @IsDate()
  @IsOptional()
  schedule: Date;
  @ApiProperty({
    description: '상담 완료 여부',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isDone: boolean;
  @ApiProperty({
    description: '휴대폰 전화번호',
    example: '010-1234-5678',
  })
  @Matches(/^010-\d{4}-\d{4}$/, {
    message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)',
  })
  @IsOptional()
  phone: string;
}
