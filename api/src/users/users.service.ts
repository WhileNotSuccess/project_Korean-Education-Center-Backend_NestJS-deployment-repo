import { Injectable, NotFoundException } from '@nestjs/common';
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
  /**
   * 관리자 이메일을 환경변수에서 받아와 id와 이메일을 비교
   * 관리자가 맞으면 true 틀리면 false
   * @param user req.user를 넣을 것 
   * @returns 
   */
  async identifyAdminUser(user){
    const adminUserEmail=process.env.ADMIN_EMAIL
    const adminUser= await this.dataSource.manager.findOneBy(User,{email:adminUserEmail})
    if(!adminUser){throw new NotFoundException('관리자가 등록되어있는지 확인해 주세요')}
    if(user.email==adminUser.email){
      return true
    }
    return false
  }
}
