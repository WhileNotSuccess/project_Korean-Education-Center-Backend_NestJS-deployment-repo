import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from 'src/common/language.enum';
import { ApplicationForm } from '../../application-form/entities/application-form.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20 })
  korean: string;
  @Column({ length: 20 })
  japanese: string;
  @Column({ length: 20 })
  english: string;
  @OneToMany(() => ApplicationForm, (applicationForm) => applicationForm.course)
  applicationForm: ApplicationForm[];
}
