import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreatePetDto } from './dto/create-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly databaseService: DatabaseService) {}
  private usernameQuery = {
    include: {
      owner: {
        select: {
          username: true,
          id: true,
        },
      },
    },
  };

  async create(dto: CreatePetDto) {
    return this.databaseService.pet.create({ data: dto });
  }

  findAll() {
    return this.databaseService.pet.findMany({
      ...this.usernameQuery,
    });
  }

  findById(id: string) {
    return this.databaseService.pet.findUnique({
      where: { id },
      ...this.usernameQuery,
    });
  }

  findAllByUser(ownerId: string) {
    return this.databaseService.pet.findMany({
      where: { ownerId },
      ...this.usernameQuery,
    });
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
