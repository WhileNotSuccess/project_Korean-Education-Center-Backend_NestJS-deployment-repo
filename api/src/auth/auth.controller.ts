import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto:SignInDto){
    return await this.authService.signIn(dto)
  }

  @Post('register')
  async register(@Body() dto:SignUpDto){
    return await this.authService.signUp(dto)
  }

  @Get('email-verify')
  async emailVerify(@Query() signupVerifyToken:string){
    
  }
}
