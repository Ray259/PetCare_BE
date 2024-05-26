import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MedicineInterceptor implements NestInterceptor {
  constructor(private readonly databaseService: DatabaseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (response) => {
        if (response.medicine && Array.isArray(response.medicine)) {
          const medicineNames = await Promise.all(
            response.medicine.map(async (id: string) => {
              const medicine = await this.databaseService.medicine.findUnique({
                where: { id },
              });
              return medicine ? medicine.name : id;
            }),
          );
          response.medicine = medicineNames;
        }
        return response;
      }),
    );
  }
}
