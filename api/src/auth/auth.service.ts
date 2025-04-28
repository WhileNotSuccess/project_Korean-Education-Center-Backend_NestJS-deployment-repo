import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
//import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // private readonly emailService: EmailService,
  ) {}

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('아이디나 비밀번호가 잘못되었습니다.');
    }
    // if (!user.emailVerifiedAt) {
    //   throw new UnauthorizedException('이메일 인증을 완료해주세요');
    // }
    if (!user.password) {
      throw new UnauthorizedException('아이디나 비밀번호가 잘못되었습니다.');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('아이디나 비밀번호가 잘못되었습니다.');
    }
    return await this.issuesAJwt(user);
  }

  async signUp(dto: SignUpDto, language) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) {
      throw new BadRequestException('해당 이메일로 가입할 수 없습니다.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
    // await this.emailService.sendSignUpEmail(
    //   dto.email,
    //   newUser.signUpVerifyToken,
    //   language,
    // );

    return { message: 'done' };
  }

  async issuesAJwt(user: User) {
    const payload = {
      sub: `${user.id}`,
      username: user.name,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
