import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signup.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { GoogleLinkAuthGuard } from './guards/google-link.guard';
import { JwtLinkGuard } from './guards/jwt-link.guard';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  frontendUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.frontendUrl = this.configService.get('FRONTEND_URL');
  }

  @ApiOperation({
    summary: '구글 로그인 페이지로 이동, 구글로 회원가입 하는 경우도 사용',
    description:
      '이미 구글 연동이나 구글 회원가입을 한 사람이 로그인할때도 사용하고, 구글로 회원가입하고 싶은 사람도 사용하는 엔드포인트',
  })
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {
    return 'googleLogin';
  }

  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect(@Req() req, @Res() res: Response) {
    if (req.user.newUser) {
      res.cookie('new_user', true, {
        maxAge: 60 * 60 * 1000,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN,
      });
    }
    if (req.user == 1) {
      res.redirect(`${this.frontendUrl}/need-link`);
    }
    const user = await this.usersService.findOneByEmail(req.user.email);
    const token = await this.authService.issuesAJwt(user);
    res.cookie('access_token', token.access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN,
    });
    res.redirect(`${this.frontendUrl}`);
  }

  @ApiOperation({ summary: '일반 로그인' })
  @ApiBody({ type: SignInDto })
  @Post('login')
  async login(@Body() dto: SignInDto, @Res() res: Response) {
    const token = await this.authService.signIn(dto);
    res.cookie('access_token', token.access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN,
    });
    res.json({
      message: 'done',
    });
  }

  @ApiOperation({ summary: '일반 회원가입' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    example: {
      message: '회원가입 완료, 이메일 인증 필요',
    },
  })
  @Post('register')
  async register(@Body() dto: SignUpDto, @Req() req: Request) {
    const language = req.cookies['language'] ?? 'korean';
    await this.authService.signUp(dto, language);
    return {
      message: '회원가입 완료, 이메일 인증 필요',
    };
  }

  @ApiExcludeEndpoint()
  @Get('email-verify')
  async emailVerify(
    @Query('signupVerifyToken') signupVerifyToken: string,
    @Res() res: Response,
  ) {
    const user =
      await this.usersService.updateUsersEmailVerifiedAt(signupVerifyToken);
    const token = await this.authService.issuesAJwt(user);
    res.cookie('access_token', token.access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN,
    });
    res.redirect(process.env.FRONTEND_URL);
  }

  @ApiOperation({
    summary: '이미 가입된 계정의 구글 연동',
    description: '회원가입된 계정으로 로그인 후 이 링크로 이동시킬 것',
  })
  @UseGuards(GoogleLinkAuthGuard, JwtLinkGuard)
  @Get('google/link')
  async googleLinkLogin() {
    return 'googleLogin';
  }

  @ApiExcludeEndpoint()
  @UseGuards(GoogleLinkAuthGuard, JwtLinkGuard)
  @Get('google/link/redirect')
  async googleLinkRedirect(@Req() req, @Res() res: Response) {
    const userFromJWT = req.customData?.jwtUser || {};
    const googleId = req.customData?.googleUser || {};
    const check = await this.usersService.findOneByGoogleId(googleId);

    if (check) {
      throw new BadRequestException('이미 가입되어있는 구글 계정입니다.');
    }
    const checkUser = await this.usersService.findOneByEmail(userFromJWT.email);
    if (checkUser.googleId) {
      throw new BadRequestException('이미 연동이 되어있습니다.');
    }
    await this.usersService.updateUserGoogleId(userFromJWT.id, googleId);
    const token = await this.authService.issuesAJwt(userFromJWT);
    res.cookie('access_token', token.access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN,
    });
    res.redirect(process.env.FRONTEND_URL);
  }
}
