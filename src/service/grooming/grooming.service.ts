import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';

@Injectable()
export class GroomingService extends BaseService implements IService {
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

  async create(dto: Prisma.GroomingServiceCreateInput) {
    return this.databaseService.groomingService.create({ data: dto });
  }

  findAll() {
    return this.databaseService.groomingService.findMany({});
  }

  findById(id: string) {
    return this.databaseService.groomingService
      .findUnique({
        where: { id },
        include: { pet: true },
      })
      .then((res: any) => {
        res.serviceName = 'Grooming Service';
        return res;
      });
  }

  findAllByPet(petId: string) {
    return this.databaseService.groomingService.findMany({
      where: { petId },
    });
  }

  update(id: string, dto: Prisma.GroomingServiceUpdateInput) {
    return this.databaseService.groomingService.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: string) {
    return this.databaseService.groomingService.delete({ where: { id } });
  }
}
