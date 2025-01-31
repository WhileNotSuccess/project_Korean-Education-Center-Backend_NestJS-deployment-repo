import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    name: 'email',
    description: '회원가입시 사용할 이메일',
    example: 'example@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    name: 'password',
    description: '비밀번호',
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    name: 'name',
    description: '유저의 이름',
    example: 'bagopa',
  })
  @IsString()
  name: string;
}
