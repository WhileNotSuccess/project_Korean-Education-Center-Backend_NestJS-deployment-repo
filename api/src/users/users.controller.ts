import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @UseGuards(AuthGuard)
  @Get('info')
  async hello(@Req() req){
    return req.user
  }

  @UseGuards(AuthGuard)
  @Patch('name')
  async updateName(@Req() req,@Body() newName: UpdateUserDto,@Res() res:Response){
    res.clearCookie('new_user')
    await this.usersService.updateUserName(req.user.id, newName)
    res.json({
      message:'이름을 성공적으로 변경했습니다.'
    })
  }
}
