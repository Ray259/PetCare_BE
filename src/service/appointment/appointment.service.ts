import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { IService } from '../IService';

@Injectable()
export class AppointmentService implements IService {
  constructor(private readonly databaseService: DatabaseService) {}

  serviceName = 'Appointment Service';

  async create(dto: Prisma.AppointmentsCreateInput) {
    return this.databaseService.appointments.create({ data: dto });
  }

  findAll() {
    return this.databaseService.appointments.findMany({});
  }

  findById(id: string) {
    return this.databaseService.appointments.findUnique({ where: { id } });
  }

  findAllByPet(petId: string) {
    return this.databaseService.appointments.findMany({
      where: { petId },
    });
  }

  update(id: string, dto: Prisma.AppointmentsUpdateInput) {
    return this.databaseService.appointments.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: string) {
    return this.databaseService.appointments.delete({ where: { id } });
  }
}
