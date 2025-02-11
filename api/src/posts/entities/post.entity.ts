import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { Language } from '../../common/language.enum';

@Entity({ name: 'posts' })
@Index("pagination_Index",["category","language"])
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
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @Column({ type: 'enum', enum: Language, default: Language.KOREAN })
  language: string;
  @Column({ nullable: true })
  expiredDate: Date;
  @OneToMany(() => Attachment, (attach) => attach.postId, {
    onDelete: 'CASCADE',
  })
  attach: Attachment[];
}
