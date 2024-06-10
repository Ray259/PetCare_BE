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
export class HealthcareService
  extends BaseService<CreateHealthcareServiceDto, UpdateHealthcareServiceDto>
  implements IService
{
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

  async update(id: string, dto: UpdateHealthcareServiceDto) {
    const { medIds, ...data } = dto;
    return this.databaseService.healthcareService.update({
      where: {
        id,
      },
      data: {
        ...data,
        medicine: medIds ? { set: medIds } : undefined,
      },
    });
  }
}
