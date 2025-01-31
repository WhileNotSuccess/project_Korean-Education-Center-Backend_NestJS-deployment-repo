import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 60 })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, length: 22 })
  googleId: string;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ length: 36 })
  signUpVerifyToken: string;
}
