import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AttachmentsModule } from 'src/attachments/attachments.module';

@Module({
  imports:[AttachmentsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
