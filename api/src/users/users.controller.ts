import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '유저의 정보 반환',
  })
  @ApiResponse({
    example: { id: 1, name: 'msy', email: 'lovesy608@naver.com' },
  })
  @UseGuards(AuthGuard)
  @Get('info')
  async hello(@Req() req) {
    console.log(req);
    const { password, googleId, emailVerifiedAt, signUpVerifyToken, ...user } =
      await this.usersService.findOneByEmail(req.user.email);
    const response = { ...user, isLinked: googleId ? true : false };
    return response;
  }

  @ApiOperation({
    summary: '유저 이름 변경',
    description:
      '유저의 이름을 변경한다. 구글 계정으로 회원가입 한 경우에도 반드시 실행해야한다.',
  })
  @ApiResponse({
    example: {
      message: '이름을 성공적으로 변경했습니다.',
    },
  })
  @UseGuards(AuthGuard)
  @Patch('name')
  async updateName(
    @Req() req,
    @Body() newName: UpdateUserDto,
    @Res() res: Response,
  ) {
    res.cookie('new_user', 'false', {
      maxAge: 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN,
    });
    await this.usersService.updateUserName(req.user.id, newName);

    res.json({
      message: '이름을 성공적으로 변경했습니다.',
    });
  }
  
  @ApiOperation({summary:'유저가 관리자인지 확인'})
  @ApiResponse({
    example:{
      message:'관리자 확인 결과입니다.',
      result:true
    }
  })
  @UseGuards(AuthGuard)
  @Get()
  async identifyUserAdmin(@Req() req){
    return {
      message:'관리자 확인 결과입니다.',
      result:await this.usersService.identifyAdminUser(req.user)
    }
  }
}
