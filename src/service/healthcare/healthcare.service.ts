import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class HealthcareService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: Prisma.HealthcareServiceCreateInput) {
    return this.databaseService.healthcareService.create({ data: dto });
  }

  findAll() {
    return this.databaseService.healthcareService.findMany({});
  }

  findById(id: string) {
    return this.databaseService.healthcareService.findUnique({ where: { id } });
  }

  findAllByUser(petId: string) {
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
