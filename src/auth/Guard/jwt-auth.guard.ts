import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Tokens } from '../../common/decorator/tokens.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // console.log('token', token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const t = this.reflector.get(Tokens, context.getHandler());
      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          t === 'access'
            ? process.env.JWT_ACCESS_SECRET || 'at-secret'
            : t === 'refresh'
              ? process.env.JWT_REFRESH_SECRET || 'at-secret'
              : '',
      });
      //   console.log('payload', payload);
      request['user'] = payload;
      request['user'].refreshToken = token;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
