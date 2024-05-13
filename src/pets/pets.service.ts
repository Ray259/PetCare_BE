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

  async findRegisteredServices(id: string) {
    const boarding = await this.databaseService.boardingService.findMany({
      where: { petId: id },
    });
    const grooming = await this.databaseService.groomingService.findMany({
      where: { petId: id },
    });
    const healthcare = await this.databaseService.healthcareService.findMany({
      where: { petId: id },
    });
    const appointments = await this.databaseService.appointments.findMany({
      where: { petId: id },
    });

    return [
      { serviceName: 'Boarding Service', services: boarding },
      { serviceName: 'Grooming Service', services: grooming },
      { serviceName: 'Healthcare Service', services: healthcare },
      { serviceName: 'Appointments', services: appointments },
    ];
  }
}
