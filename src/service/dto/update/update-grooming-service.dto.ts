import { IsDateString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class UpdateGroomingServiceDto {
  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsObject()
  @IsOptional()
  additionalInfo?: Record<string, any>;
}
