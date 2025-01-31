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
    const { password, googleId, emailVerifiedAt, signUpVerifyToken, ...user } =
      await this.usersService.findOneByEmail(req.user.email);
    return user;
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
    res.clearCookie('new_user');
    await this.usersService.updateUserName(req.user.id, newName);

    res.json({
      message: '이름을 성공적으로 변경했습니다.',
    });
  }
}
