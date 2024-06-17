import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ServiceStatus } from 'src/common/enums/service-status';

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

  @IsOptional()
  status?: ServiceStatus;

  @IsString()
  @IsNotEmpty()
  serviceId: string;
}
