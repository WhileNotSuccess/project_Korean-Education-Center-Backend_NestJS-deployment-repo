import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { Language } from '../../common/language.enum';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'posts' })
@Index('pagination_Index', ['category', 'language'])
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255 })
  title: string;
  @Column({ type: 'longtext' })
  content: string;
  @Column({ nullable: true })
  userId: number;

  @Column({ length: 100, nullable: true })
  writerName: string;

  @Column({ length: 255, nullable: true })
  password?: string;
  @Column({ length: 25 })
  category: string;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @Column({ type: 'enum', enum: Language, default: Language.KOREAN })
  language: string;
  @Column({ default: false })
  isPinned: boolean;
  @Column({ type: 'longtext', nullable: true })
  answer: string;
  @Column({ default: false })
  isSecret: boolean;
  @Column({ nullable: true })
  answerDate: Date;
  @OneToMany(() => Attachment, (attach) => attach.postId, {
    onDelete: 'CASCADE',
  })
  attaches: Attachment[];
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
