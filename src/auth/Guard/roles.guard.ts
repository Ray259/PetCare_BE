import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/common/decorator/roles.decorator';
import { extractHeaderTokens } from 'src/utils/auth/extractHeaderTokens.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractHeaderTokens(request);
    const roles = this.reflector.get(Roles, context.getHandler());
    // console.log(roles);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'at-secret',
      });
      // console.log(payload);
      const userRole = payload.role;
      return matchRoles(roles, userRole);
    } catch {
      throw new UnauthorizedException();
    }
  }
}

function matchRoles(roles: string[], userRoles: any): boolean {
  if (!roles.includes(userRoles)) {
    throw new ForbiddenException();
  }
  return true;
}
