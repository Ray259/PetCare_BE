import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsNotEmpty()
  petId: string;

  @IsDateString()
  @IsOptional()
  date: Date;

  @IsObject()
  @IsOptional()
  additionalInfo?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
