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
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationAttachmentsModule } from './application-attachments/application-attachments.module';
import { ApplicationAttachment } from './application-attachments/entities/application-attachment.entity';
import { PostImages } from './attachments/entities/post-images.entity';
import { BatchModule } from './batch/batch.module';
import { CourseModule } from './course/course.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/files',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: 3306,
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [
          Post,
          ApplicationForm,
          Attachment,
          Banner,
          ApplicationAttachment,
          ConsultationRequest,
          Staff,
          User,
          PostImages,
        ],
        synchronize: false,
      }),
    }),
    PostsModule,
    ApplicationFormModule,
    AttachmentsModule,
    BannersModule,
    ApplicationAttachmentsModule,
    ConsultationRequestModule,
    StaffModule,
    UsersModule,
    AuthModule,
    EmailModule,
    BatchModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
