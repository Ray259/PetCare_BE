import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ServiceStatus } from 'src/common/enums/service-status';

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

  @IsOptional()
  status?: ServiceStatus;

  serviceId: string;
}
