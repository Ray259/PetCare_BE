import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsOptional()
  petId: string;

  @IsDateString()
  @IsOptional()
  date: Date;
}
