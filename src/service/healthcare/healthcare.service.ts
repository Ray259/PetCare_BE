import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateHealthcareServiceDto } from '../dto/create/create-healthcare-service.dto';
import { UpdateHealthcareServiceDto } from '../dto/update/update-healthcare-service.dto';

const SERVICE_NAME = 'Healthcare Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class HealthcareService extends BaseService implements IService {
  constructor(
    protected readonly databaseService: DatabaseService,
    @Inject(DiscoveryService)
    protected readonly discoveryService: DiscoveryService,
  ) {
    super(databaseService, discoveryService);
  }
  private readonly serviceName: string = SERVICE_NAME;
  protected getModel() {
    return this.databaseService.healthcareService;
  }

  protected getServiceName(): string {
    return this.serviceName;
  }

  async create(role: string, dto: CreateHealthcareServiceDto) {
    if (role === 'user') {
      return this.createBase(dto);
    } else if (role === 'admin') {
      return this.databaseService.healthcareService.create({
        data: {
          petId: dto.petId,
          description: dto.description,
          diet: dto.diet,
          date: dto.date,
          medicine: dto.medIds,
          additionalInfo: dto.additionalInfo,
        },
      });
    }
  }

  async update(id: string, dto: UpdateHealthcareServiceDto) {
    let medicineIds: string[] | undefined;
    if (dto.medIds) {
      medicineIds = dto.medIds;
    }
    return this.databaseService.healthcareService.update({
      where: {
        id,
      },
      data: {
        description: dto.description,
        diet: dto.diet,
        date: dto.date,
        medicine: medicineIds ? { set: medicineIds } : undefined,
        additionalInfo: dto.additionalInfo,
      },
    });
  }
}
