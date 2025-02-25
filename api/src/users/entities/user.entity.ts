import { ApplicationForm } from '../../application-form/entities/application-form.entity';
import { Post } from '../../posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 60 })
  password: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ nullable: true, length: 22 })
  googleId: string;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ length: 36 })
  signUpVerifyToken: string;

  @OneToMany(() => Post, (post) => post.userId, {
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @OneToMany(
    () => ApplicationForm,
    (applicationForm) => applicationForm.userId,
    {
      onDelete: 'CASCADE',
    },
  )
  applications: ApplicationForm[];
}
