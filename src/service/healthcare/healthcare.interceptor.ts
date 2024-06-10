import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from 'src/database/database.service';
import { UpdateHealthcareServiceDto } from '../dto/update/update-healthcare-service.dto';
import { CreateMedicineDto } from 'src/medicine/dto/create-medicine.dto';
import { CreateHealthcareServiceDto } from '../dto/create/create-healthcare-service.dto';
import { Reflector } from '@nestjs/core';
import { RequestTypes } from 'src/common/decorator/request-type.decorator';
import { RequestType } from 'src/common/enums/request-type.enum';

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
  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
    private readonly reflector: Reflector,
  ) {}

  async getMedIds(meds: string[]): Promise<string[]> {
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
    return medIds;
  }
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
    const dtoType = this.reflector.get(RequestTypes, context.getHandler());
    let joinedMeds: string;
    let medIds: string[];
    let dto: CreateHealthcareServiceDto | UpdateHealthcareServiceDto;

    if (dtoType === RequestType.Create) {
      dto = req.body as CreateHealthcareServiceDto;
    } else if (dtoType === RequestType.Update) {
      dto = req.body as UpdateHealthcareServiceDto;
    }

    if (typeof dto.temperature === 'string') {
      dto.temperature = parseFloat(dto.temperature);
    }
    if (typeof dto.heartRate === 'string') {
      dto.heartRate = parseFloat(dto.heartRate);
    }
    if (typeof dto.weight === 'string') {
      dto.weight = parseFloat(dto.weight);
    }
    if (typeof dto.respiratoryRate === 'string') {
      dto.respiratoryRate = parseFloat(dto.respiratoryRate);
    }

    if (dto.medicine && dto.medicine.length > 0) {
      const meds: string[] = extractMeds(dto.medicine);
      medIds = await this.getMedIds(meds);
      dto.medIds = medIds;
      joinedMeds = meds.join('; ');
    }

    return next.handle().pipe(
      map((response) => {
        return {
          ...response,
          temparature: dto.temperature,
          heartRate: dto.heartRate,
          weight: dto.weight,
          respiratoryRate: dto.respiratoryRate,
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
