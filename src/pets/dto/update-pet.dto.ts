import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/gender.enum';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class UpdatePetDto {
  name?: string;
  age?: number;
  color?: string;
  gender?: Gender;
  breed?: string;
  avatar?: string;
  weight?: number;
  disease?: string;
  ownerId: string;
}
