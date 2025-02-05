import { Language } from 'src/common/language.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Banner' })
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 70 })
  image: string; // 이미지 url
  @Column({ type: 'enum', enum: Language, default: Language.KOREAN })
  language: string;
  @Column()
  expiredDate: Date;
  @Column({ length: 80 })
  url: string; // 이미지 클릭시 이동할 url
}
