import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class CreatePetDto {
  id?: string;
  name: string;
  age: number;
  color: string;
  gender: string;
  breed: string;
  avatar: string;
  weight: number;
  disease?: string;
  ownerId: string;
}
