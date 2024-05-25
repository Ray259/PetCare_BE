import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class UpdateBoardingServiceDto {
  @IsInt()
  @IsOptional()
  cage?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsObject()
  @IsOptional()
  additionalInfo?: Record<string, any>;
}
