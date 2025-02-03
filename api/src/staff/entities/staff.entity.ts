import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  position: string;

  @Column({ length: 13 })
  phone: string;

  @Column({ length: 100 })
  email: string;
}
