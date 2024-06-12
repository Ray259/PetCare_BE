import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { CreateDto } from 'src/service/dto/create/Create-Base.dto';

@ApplyToAllProperties(ApiProperty)
export class UpdateAppointmentDto extends CreateDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  followUp?: boolean;
}
