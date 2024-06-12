import { IsNotEmpty, IsString } from 'class-validator';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseRevenueDto } from './Response-Revenue.dto';

@ApplyToAllProperties(ApiProperty)
export class ResponseServiceDto extends ResponseRevenueDto {
  @IsString()
  @IsNotEmpty()
  serviceName: string;
}
