import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateGroomingServiceDto } from '../dto/create/create-grooming-service.dto';

const SERVICE_NAME = 'Grooming Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class GroomingService extends BaseService implements IService {
  constructor(
    protected readonly databaseService: DatabaseService,
    @Inject(DiscoveryService)
    protected readonly discoveryService: DiscoveryService,
  ) {
    super(databaseService, discoveryService);
  }
  private readonly serviceName: string = SERVICE_NAME;
  protected getModel() {
    return this.databaseService.groomingService;
  }

  protected getServiceName(): string {
    return this.serviceName;
  }

  async create(dto: CreateGroomingServiceDto) {
    return this.databaseService.groomingService.create({ data: dto });
  }

  update(id: string, dto: Prisma.GroomingServiceUpdateInput) {
    return this.databaseService.groomingService.update({
      where: {
        id,
      },
      data: dto,
    });
  }
}
