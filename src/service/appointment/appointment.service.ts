import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { IService } from 'src/service/Base/IService';
import { BaseService } from 'src/service/Base/BaseService.service';

@Injectable()
export class AppointmentService extends BaseService implements IService {
  constructor(protected readonly databaseService: DatabaseService) {
    super(databaseService);
  }
  serviceName: string;
  protected getModel() {
    return this.databaseService.appointments;
  }

  protected getServiceName(): string {
    return 'Appointment Service';
  }

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
