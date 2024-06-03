import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class CreateHealthcareServiceDto {
  @IsUUID()
  @IsNotEmpty()
  petId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  diet: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsOptional()
  medicine: string;

  @IsObject()
  @IsOptional()
  additionalInfo?: Record<string, any>;

  @IsArray()
  medIds?: string[];

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
