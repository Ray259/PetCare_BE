import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';

@Injectable()
export class BoardingService extends BaseService implements IService {
  constructor(protected readonly databaseService: DatabaseService) {
    super(databaseService);
  }
  serviceName: string;
  protected getModel() {
    return this.databaseService.appointments;
  }

  protected getServiceName(): string {
    return 'Boarding Service';
  }

  async create(dto: Prisma.BoardingServiceCreateInput) {
    return this.databaseService.boardingService.create({ data: dto });
  }

  findAll() {
    return this.databaseService.boardingService.findMany({});
  }

  findById(id: string) {
    return this.databaseService.boardingService.findUnique({ where: { id } });
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
