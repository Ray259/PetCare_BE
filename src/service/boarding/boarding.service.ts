import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateBoardingServiceDto } from '../Dto/create/create-boarding-service.dto';

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

  async create(dto: CreateBoardingServiceDto) {
    return this.databaseService.boardingService.create({ data: dto });
  }

  findAll() {
    return this.databaseService.boardingService.findMany({});
  }

  findById(id: string) {
    return this.databaseService.boardingService
      .findUnique({
        where: { id },
        include: { pet: true },
      })
      .then((res: any) => {
        res.serviceName = this.serviceName;
        return res;
      });
  }

  findAllByPet(petId: string) {
    return this.databaseService.boardingService.findMany({
      where: { petId },
    });
  }

  update(id: string, dto: Prisma.BoardingServiceUpdateInput) {
    return this.databaseService.boardingService.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: string) {
    return this.databaseService.boardingService.delete({ where: { id } });
  }
}
