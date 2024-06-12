import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from 'src/service/Base/BaseService.service';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateHealthcareServiceDto } from 'src/service/dto/create/create-healthcare-service.dto';
import { UpdateHealthcareServiceDto } from 'src/service/dto/update/update-healthcare-service.dto';
import { RevenueService } from 'src/revenue/revenue.service';

const SERVICE_NAME = 'Healthcare Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class HealthcareService extends BaseService<
  CreateHealthcareServiceDto,
  UpdateHealthcareServiceDto
> {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly revenueService: RevenueService,
    @Inject(DiscoveryService)
    protected readonly discoveryService: DiscoveryService,
  ) {
    super(databaseService, revenueService, discoveryService);
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
