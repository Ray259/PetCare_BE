import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateHealthcareServiceDto } from '../dto/create/create-healthcare-service.dto';

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

  async create(dto: CreateHealthcareServiceDto) {
    return this.databaseService.healthcareService.create({ data: dto });
  }

  findAll() {
    return this.databaseService.healthcareService.findMany({});
  }

  findById(id: string) {
    return this.databaseService.healthcareService.findUnique({ where: { id } });
  }

  findAllByPet(petId: string) {
    return this.databaseService.healthcareService.findMany({
      where: { petId },
    });
  }

  update(id: string, dto: Prisma.HealthcareServiceUpdateInput) {
    return this.databaseService.healthcareService.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: string) {
    return this.databaseService.healthcareService.delete({ where: { id } });
  }
}
