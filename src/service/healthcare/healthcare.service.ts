import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';

@Injectable()
export class HealthcareService extends BaseService implements IService {
  constructor(protected readonly databaseService: DatabaseService) {
    super(databaseService);
  }
  serviceName: string;
  protected getModel() {
    return this.databaseService.groomingService;
  }

  protected getServiceName(): string {
    return 'Boarding Service';
  }

  async create(dto: Prisma.HealthcareServiceCreateInput) {
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
