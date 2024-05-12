import { UseGuards, applyDecorators } from '@nestjs/common';
import { Tokens } from 'src/common/decorator/tokens.decorator';
import { AuthGuard } from 'src/auth/Guard/jwt-auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/Guard/roles.guard';
import { Role } from 'src/common/enums/role.enum';

export function AuthUtils(roles: Role[], token: string) {
  return applyDecorators(
    UseGuards(AuthGuard),
    UseGuards(RolesGuard),
    Tokens(token),
    Roles(...roles),
  );
}
