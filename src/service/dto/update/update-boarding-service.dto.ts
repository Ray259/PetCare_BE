import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { CreateDto } from '../create/Create-Base.dto';

@ApplyToAllProperties(ApiProperty)
export class UpdateBoardingServiceDto extends CreateDto {
  @IsInt()
  @IsOptional()
  cage?: number;

  @IsString()
  @IsOptional()
  address?: string;
}
