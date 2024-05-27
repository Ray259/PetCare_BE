import { IsDateString, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class UpdateHealthcareServiceDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  diet?: string;

  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  medicine?: string;

  @IsObject()
  @IsOptional()
  additionalInfo?: Record<string, any>;
}
