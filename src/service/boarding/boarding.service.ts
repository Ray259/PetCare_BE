import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from 'src/service/Base/BaseService.service';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateBoardingServiceDto } from 'src/service/dto/create/create-boarding-service.dto';
import { UpdateBoardingServiceDto } from 'src/service/dto/update/update-boarding-service.dto';
import { RevenueService } from 'src/revenue/revenue.service';

const SERVICE_NAME = 'Boarding Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class BoardingService extends BaseService<
  CreateBoardingServiceDto,
  UpdateBoardingServiceDto
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
    return this.databaseService.boardingService;
  }

  protected getServiceName(): string {
    return this.serviceName;
  }
}
