import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardingService {
  constructor(private readonly databaseService: DatabaseService) {}

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
