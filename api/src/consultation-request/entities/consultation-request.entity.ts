import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConsultationRequest {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  email: string;
  @Column()
  schedule: Date;
  @Column({ default: false })
  isDone: boolean;
  @Column({ length: 13 })
  phone: string;
  @Column({ length: 100 })
  name: string;
}
