import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  petId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsBoolean()
  @IsOptional()
  followUp?: boolean;

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
