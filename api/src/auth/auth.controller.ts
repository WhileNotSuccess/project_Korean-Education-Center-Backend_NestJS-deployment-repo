import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signup.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { GoogleLinkAuthGuard } from './guards/google-link.guard';
import { JwtLinkGuard } from './guards/jwt-link.guard';

@Controller('auth')
export class AuthController {
  frontendUrl:string

  constructor(
    private readonly authService: AuthService,
    private readonly configService:ConfigService,
    private readonly usersService:UsersService
  ) {
    this.frontendUrl = this.configService.get("FRONTEND_URL")
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin(){
    return 'googleLogin';
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect(@Req() req, @Res() res:Response){
    if(req.user.newUser){
      res.cookie('new_user',true)
    }
    const user = await this.usersService.findOneByEmail(req.user.email)
    const token = await this.authService.issuesAJwt(user)
    res.cookie('access_token',token.access_token)
    res.redirect(`${this.frontendUrl}`)
  }

  @Post('login')
  async login(@Body() dto:SignInDto,@Res() res:Response){
    console.log('object')
    const token = await this.authService.signIn(dto)
    res.cookie('access_token',token.access_token)
    res.redirect(process.env.FRONTEND_URL)
  }

  @Post('register')
  async register(@Body() dto:SignUpDto,@Req() req:Request){
    const language = req.cookies['language'] ?? 'korean'
    await this.authService.signUp(dto, language)
    return {
      message: '회원가입 완료, 이메일 인증 필요'
    }
  }

  @Get('email-verify')
  async emailVerify(@Query('signupVerifyToken') signupVerifyToken:string,@Res() res:Response){
    const user = await this.usersService.updateUsersEmailVerifiedAt(signupVerifyToken)
    const token = await this.authService.issuesAJwt(user)
    res.cookie('access_token',token.access_token)
    res.redirect(process.env.FRONTEND_URL)
  }

  @UseGuards(GoogleLinkAuthGuard,JwtLinkGuard)
  @Get('google/link')
  async googleLinkLogin(){
    return 'googleLogin';
  }

  @UseGuards(GoogleLinkAuthGuard,JwtLinkGuard)
  @Get('google/link/redirect')
  async googleLinkRedirect(@Req() req){
    const userFromJWT = req.customData?.jwtUser || {};
    const googleId = req.customData?.googleUser || {};
    const check = await this.usersService.findOneByGoogleId(googleId)

    if(check){
      throw new BadRequestException('이미 가입되어있는 구글 계정입니다.')
    }
    const checkUser = await this.usersService.findOneByEmail(userFromJWT.email)
    if(checkUser.googleId){
      throw new BadRequestException('이미 연동이 되어있습니다.')
    }
    await this.usersService.updateUserGoogleId(userFromJWT.id,googleId)
    return {
      message:"연동완료"
    }
  }
}
