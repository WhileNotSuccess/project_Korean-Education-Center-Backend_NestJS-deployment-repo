import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { Language } from 'src/common/language.enum';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  title: string;
  @Column({ type: 'longtext' })
  content: string;
  @Column({ length: 100 })
  author: string;
  @Column({ length: 25 })
  category: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ type: 'enum', enum: Language, default: Language.KOREAN })
  language: string;
  @Column({ nullable: true })
  expiredAt: Date;
  @OneToMany(() => Attachment, (attach) => attach.postId, {
    onDelete: 'CASCADE',
  })
  attach: Attachment[];
}
