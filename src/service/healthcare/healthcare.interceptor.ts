import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from 'src/database/database.service';
import { UpdateHealthcareServiceDto } from '../dto/update/update-healthcare-service.dto';
import { CreateMedicineDto } from 'src/medicine/dto/create-medicine.dto';

@Injectable()
export class GetHealthcareMedicineInterceptor implements NestInterceptor {
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
              return medicine ? medicine.name : undefined;
            }),
          );
          response.medicine = medicineNames?.join('; ');
        }
        return response;
      }),
    );
  }
}

@Injectable()
export class CreateOrUpdateHealthcareMedicineInterceptor
  implements NestInterceptor
{
  constructor(private readonly databaseService: DatabaseService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    /**
     * Request medicine string ('a; b; c') - extract, query by names - map all ids to medIds array in dto
     * Service and controller handle update by medIds
     * Intercept response with joined extracted medicine string
     **/
    const req = context.switchToHttp().getRequest();
    const dto: UpdateHealthcareServiceDto = req.body;
    const meds: string[] = extractMeds(dto.medicine);

    const medIds: string[] = await Promise.all(
      meds.map(async (med) => {
        const exMed = await this.databaseService.medicine.findFirst({
          where: { name: med },
        });
        if (exMed) {
          return exMed.id;
        } else {
          const createdMedicineId = await createMedicine(
            this.databaseService,
            med,
          );
          return createdMedicineId;
        }
      }),
    );

    dto.medIds = medIds;

    const joinedMeds = meds.join('; ');

    return next.handle().pipe(
      map((response) => {
        return {
          ...response,
          medicine: joinedMeds,
        };
      }),
    );
  }
}

const extractMeds = (input: string): string[] => {
  return input.split(';').map((str: string) => str.replace(/\s+/g, ' '));
};

const createMedicine = async (
  databaseService: DatabaseService,
  name: string,
): Promise<string> => {
  const newMedicineDto: CreateMedicineDto = {
    name: name,
    description: '',
  };
  const createdMedicine = await databaseService.medicine.create({
    data: newMedicineDto,
  });
  return createdMedicine.id;
};
