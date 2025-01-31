import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    name: 'email',
    description: '가입되어있는 이메일',
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
}
