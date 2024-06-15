import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/gender.enum';
import { Role } from 'src/common/enums/role.enum';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class RegisterDto {
  email: string;
  username: string;
  password?: string | null;
  phone?: string | null;
  role?: Role;
  avatar?: string | null;
  gender?: Gender;
}
