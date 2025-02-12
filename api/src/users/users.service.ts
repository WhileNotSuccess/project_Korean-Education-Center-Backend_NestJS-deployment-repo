import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { transactional } from 'src/common/utils/transaction-helper';
import * as uuid from 'uuid'
@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource:DataSource
  ){}
  async create(createUserDto: CreateUserDto) {
    
    return transactional<User>(this.dataSource, async (queryRunner)=>{
      const signUpVerifyToken = uuid.v1()
      const user = queryRunner.manager.save(User,{...createUserDto,signUpVerifyToken})
      return user
    })
  }

  async updateUsersEmailVerifiedAt(signUpVerifyToken:string):Promise<User>{
    const user = await this.dataSource.manager.findOneBy(User,{signUpVerifyToken:signUpVerifyToken})
    if(user){
      return transactional<User>(this.dataSource, async (queryRunner)=>{
        const now = new Date()
        await queryRunner.manager.update(User, { signUpVerifyToken }, { emailVerifiedAt: now });
        return user
      })
    }else{
      return null
    }
  }
  async findOneByEmail(email: string) {
    const user = await this.dataSource.manager.findOneBy(User,{email})
    return user;
  }
  async findOneByGoogleId(googleId:string){
    const user = await this.dataSource.manager.findOneBy(User,{googleId})
    return user;
  }

  async updateUserName(id:number, dto:UpdateUserDto){
    return transactional<void>(this.dataSource, async (queryRunner)=>{
      await queryRunner.manager.update(User, { id }, { name: dto.name });
    })
  }
  
  async updateUserGoogleId(id:number, googleId:string){
    return transactional<void>(this.dataSource, async (queryRunner)=>{
      await queryRunner.manager.update(User, { id }, { googleId });
    })
  }
}
