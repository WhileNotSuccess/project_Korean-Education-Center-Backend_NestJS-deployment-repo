import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class PostImages {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  postId: number;
  @Column({ length: 100 })
  filename: string;
  @Column()
  fileSize: number;
  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;
}
