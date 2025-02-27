import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from 'src/common/language.enum';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20 })
  korean:string;
  @Column({ length: 20 })
  japanese:string;  
  @Column({ length: 20 })
  english:string;
}

