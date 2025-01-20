import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signup.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  frontendUrl:string

  constructor(private readonly authService: AuthService,
    private readonly configService:ConfigService
  ) {
    this.frontendUrl = this.configService.get("FRONTEND_URL")
  }

  @Post('login')
  async login(@Body() dto:SignInDto,@Res() res:Response){
    const token = await this.authService.signIn(dto)
    res.cookie('access_token',token.access_token)
    res.redirect(process.env.FRONTEND_URL)
  }

  @Post('register')
  async register(@Body() dto:SignUpDto,@Req() req:Request){
    const language = req.cookies['language'] ?? 'korean'
    return await this.authService.signUp(dto, language)
  }

  @Get('email-verify')
  async emailVerify(@Query('signupVerifyToken') signupVerifyToken:string,@Res() res:Response){
    const user = await this.authService.emailVerify(signupVerifyToken)
    const token = await this.authService.issuesAJwt(user)
    res.cookie('access_token',token.access_token)
    res.redirect(process.env.FRONTEND_URL)
  }
}
