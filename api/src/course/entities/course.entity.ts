import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from 'src/common/language.enum';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20 })
  Korean:string;
  @Column({ length: 20 })
  Japanese:string;  
  @Column({ length: 20 })
  English:string;
}

