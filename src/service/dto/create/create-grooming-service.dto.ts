import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class CreateGroomingServiceDto {
  @IsUUID()
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
