import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PetInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { age, weight } = request.body;
    if (typeof age === 'string') {
      request.body.age = parseInt(age, 10);
    }
    if (typeof weight === 'string') {
      request.body.weight = parseInt(weight);
    }
    return next.handle();
  }
}
