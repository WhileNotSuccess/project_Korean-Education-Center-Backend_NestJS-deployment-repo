import { User } from '../../users/entities/user.entity';
import { ApplicationAttachment } from '../../application-attachments/entities/application-attachment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';

@Entity({ name: 'ApplicationForm' })
export class ApplicationForm {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  courseId: number;
  @CreateDateColumn()
  createdDate: Date;
  @Column({ default: false })
  isDone: boolean;
  @Column({ length: 30 })
  phoneNumber: string;
  @OneToMany(
    () => ApplicationAttachment,
    (attachment) => attachment.applicationId,
    { onDelete: 'CASCADE' },
  )
  applicationAttachment: ApplicationAttachment[];
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @ManyToOne(() => Course, (course) => course.id)
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
