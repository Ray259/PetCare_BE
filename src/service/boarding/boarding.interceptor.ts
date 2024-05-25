import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BoardingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { cage } = request.body;
    if (typeof cage === 'string') {
      request.body.cage = parseInt(cage, 10);
    }
    return next.handle();
  }
}
