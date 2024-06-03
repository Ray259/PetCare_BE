import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class BaseDto {
  @IsString()
  @IsNotEmpty()
  petId: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
