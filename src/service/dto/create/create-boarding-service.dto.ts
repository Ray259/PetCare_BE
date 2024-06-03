import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class CreateBoardingServiceDto {
  @IsUUID()
  @IsNotEmpty()
  petId: string;

  @IsInt()
  @IsOptional()
  cage: number;

  @IsString()
  @IsOptional()
  address: string;

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
