import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { CreateDto } from './Create-Base.dto';

@ApplyToAllProperties(ApiProperty)
export class CreateAppointmentDto extends CreateDto {
  @IsString()
  @IsNotEmpty()
  doctor: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  followUp?: boolean;
}
