import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from 'src/service/Base/BaseService.service';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateBoardingServiceDto } from 'src/service/dto/create/create-boarding-service.dto';
import { UpdateBoardingServiceDto } from 'src/service/dto/update/update-boarding-service.dto';

const SERVICE_NAME = 'Boarding Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class BoardingService extends BaseService<
  CreateBoardingServiceDto,
  UpdateBoardingServiceDto
> {
  constructor(
    protected readonly databaseService: DatabaseService,
    @Inject(DiscoveryService)
    protected readonly discoveryService: DiscoveryService,
  ) {
    super(databaseService, discoveryService);
  }
  private readonly serviceName: string = SERVICE_NAME;
  protected getModel() {
    return this.databaseService.boardingService;
  }

  protected getServiceName(): string {
    return this.serviceName;
  }
}
