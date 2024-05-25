import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class UpdatePetDto {
  name?: string;
  age?: number;
  color?: string;
  gender?: string;
  breed?: string;
  avatar?: string;
  ownerId: string;
}
