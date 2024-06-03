import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateBoardingServiceDto } from '../dto/create/create-boarding-service.dto';

const SERVICE_NAME = 'Boarding Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class BoardingService extends BaseService implements IService {
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

  async create(role: string, dto: CreateBoardingServiceDto) {
    if (role === 'user') {
      return this.createBase(dto);
    } else if (role === 'admin') {
      return this.databaseService.boardingService.create({ data: dto });
    }
  }

  update(id: string, dto: Prisma.BoardingServiceUpdateInput) {
    return this.databaseService.boardingService.update({
      where: {
        id,
      },
      data: dto,
    });
  }
}
