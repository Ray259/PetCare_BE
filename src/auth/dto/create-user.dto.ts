import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { ApplyToAllProperties } from 'src/utils/decorator/apply-to-all-properties.decorator';

@ApplyToAllProperties(ApiProperty)
export class CreateUserDto {
  email: string;
  username: string;
  password?: string | null;
  phone?: string | null;
  role?: Role;
  avatar?: string | null;
  gender?: string | null;
}
