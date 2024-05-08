import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PetsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: Prisma.PetCreateInput) {
    return this.databaseService.pet.create({ data: dto });
  }

  findAll() {
    return this.databaseService.pet.findMany({});
  }

  findById(id: string) {
    return this.databaseService.pet.findUnique({ where: { id } });
  }

  findAllByUser(ownerId: string) {
    return this.databaseService.pet.findMany({ where: { ownerId } });
  }

  update(id: string, dto: Prisma.PetUpdateInput) {
    return this.databaseService.pet.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: string) {
    return this.databaseService.pet.delete({ where: { id } });
  }
}
