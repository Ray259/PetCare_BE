import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GroomingService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: Prisma.GroomingServiceCreateInput) {
    return this.databaseService.groomingService.create({ data: dto });
  }

  findAll() {
    return this.databaseService.groomingService.findMany({});
  }

  findById(id: string) {
    return this.databaseService.groomingService.findUnique({ where: { id } });
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
