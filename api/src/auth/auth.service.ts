import { BadGatewayException, BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signIn.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService:UsersService,
    private readonly config:ConfigService,
    private readonly jwtService:JwtService,
    private readonly emailService:EmailService
  ){}

  async signIn(dto:SignInDto){
    const user = await this.usersService.findOneByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return await this.issuesAJwt(user)
  }

  async signUp(dto:SignUpDto){
    const user = await this.usersService.findOneByEmail(dto.email)
    if (user) {
      throw new BadRequestException('해당 이메일로 가입할 수 없습니다.')
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await this.usersService.create({
      ...dto,password:hashedPassword
    })
    await this.emailService.sendSignUpEmail(newUser.signUpVerifyToken)
  }

  async issuesAJwt(user:User){
    console.log(user)
    const payload = {
      sub:`${user.id}`,
      username:user.name,
      email:user.email
    }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  } 
}
