import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

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
  async updateName(@Req() req,@Body() newName: UpdateUserDto){
    return this.usersService.updateUserName(req.user.id, newName)
  }
}
