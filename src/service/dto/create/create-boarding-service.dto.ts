import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { CreateDto } from './Create-Base.dto';

@ApplyToAllProperties(ApiProperty)
export class CreateBoardingServiceDto extends CreateDto {
  @IsInt()
  @IsOptional()
  cage: number;

  @IsString()
  @IsOptional()
  address: string;
}
