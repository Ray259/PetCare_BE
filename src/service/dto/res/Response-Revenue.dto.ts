import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { ApiProperty } from '@nestjs/swagger';

@ApplyToAllProperties(ApiProperty)
export class ResponseRevenueDto {
  @IsString()
  @IsNotEmpty()
  total: string;

  @IsDateString()
  @IsNotEmpty()
  lastUpdate: Date;
}
