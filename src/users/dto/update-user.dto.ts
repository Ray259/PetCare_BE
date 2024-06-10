import { Role } from 'src/common/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';
import { Gender } from 'src/common/enums/gender.enum';

@ApplyToAllProperties(ApiProperty)
export class UpdateUserDto {
  email?: string;
  username?: string;
  password?: string | null;
  phone?: string | null;
  role?: Role;
  avatar?: string | null;
  gender?: Gender;
}
