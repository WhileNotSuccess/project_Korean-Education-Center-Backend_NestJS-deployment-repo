import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { ApplicationFormModule } from './application-form/application-form.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { BannersModule } from './banners/banners.module';
import { ConsultationRequestModule } from './consultation-request/consultation-request.module';
import { StaffModule } from './staff/staff.module';
import { UsersModule } from './users/users.module';
import { Post } from './posts/entities/post.entity';
import { ApplicationForm } from './application-form/entities/application-form.entity';
import { Attachment } from './attachments/entities/attachment.entity';
import { Banner } from './banners/entities/banner.entity';
import { ConsultationRequest } from './consultation-request/entities/consultation-request.entity';
import { Staff } from './staff/entities/staff.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService)=>({
        type: 'mysql',
        host: config.get<string>("DB_HOST"),
        port: 3306,
        username: config.get<string>("DB_USER"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        entities: [Post,ApplicationForm,Attachment,Banner,ConsultationRequest,Staff,User],
        synchronize: true,
      })
    }),
    PostsModule,
    ApplicationFormModule,
    AttachmentsModule,
    BannersModule,
    ConsultationRequestModule,
    StaffModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
