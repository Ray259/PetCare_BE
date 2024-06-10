import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { UpdateDto } from './Update-Base.dto';

@ApplyToAllProperties(ApiProperty)
export class UpdateGroomingServiceDto extends UpdateDto {}
