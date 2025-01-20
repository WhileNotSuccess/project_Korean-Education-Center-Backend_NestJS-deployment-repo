import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[
    EmailModule,
    UsersModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        global:true,
        secret:config.get('JWT_SECRET'),
        signOptions:{expiresIn:'1h'}
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
