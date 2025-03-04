import { IsNumber, IsString } from 'class-validator';

export class CreateApplicationFormDto {
  @IsNumber()
  courseId: number;
  @IsString()
  phoneNumber: string;
}
