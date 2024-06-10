import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { UpdateDto } from './Update-Base.dto';

@ApplyToAllProperties(ApiProperty)
export class UpdateHealthcareServiceDto extends UpdateDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  bodyCondition?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  bloodTest?: string;

  @IsString()
  @IsOptional()
  urineTest?: string;

  @IsString()
  @IsOptional()
  xRay?: string;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  diet?: string;

  @IsString()
  @IsOptional()
  medicine?: string;

  @IsArray()
  medIds?: string[];
}
