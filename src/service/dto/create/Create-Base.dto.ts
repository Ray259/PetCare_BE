import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  petId: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsObject()
  @IsOptional()
  additionalInfo?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
