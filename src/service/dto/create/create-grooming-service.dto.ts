import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { CreateDto } from './Create-Base.dto';

@ApplyToAllProperties(ApiProperty)
export class CreateGroomingServiceDto extends CreateDto {}
