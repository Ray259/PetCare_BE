import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { extractHeaderTokens } from 'src/utils/auth/extractHeaderTokens.util';
import { Tokens } from 'src/common/decorator/tokens.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractHeaderTokens(request);
    // console.log('token', token);
    if (!token) {
      throw new UnauthorizedException('jwt token is required');
    }
    try {
      const t = this.reflector.get(Tokens, context.getHandler());
      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          t === 'access'
            ? process.env.JWT_ACCESS_SECRET || 'at-secret'
            : t === 'refresh'
              ? process.env.JWT_REFRESH_SECRET || 'rt-secret'
              : '',
      });
      console.log('payload', payload);
      request['user'] = payload;
      if (t === 'refresh') request['user'].refreshToken = token;
    } catch (e) {
      throw e;
    }
    return true;
  }
}
