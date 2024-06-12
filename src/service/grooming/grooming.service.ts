import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from 'src/service/Base/BaseService.service';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateGroomingServiceDto } from 'src/service/dto/create/create-grooming-service.dto';
import { RevenueService } from 'src/revenue/revenue.service';

const SERVICE_NAME = 'Grooming Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class GroomingService extends BaseService<
  CreateGroomingServiceDto,
  CreateGroomingServiceDto
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
    return this.databaseService.groomingService;
  }

  protected getServiceName(): string {
    return this.serviceName;
  }
}
