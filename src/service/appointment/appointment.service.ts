import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { IService } from 'src/service/Base/IService';
import { BaseService } from 'src/service/Base/BaseService.service';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { DiscoveryService } from '@nestjs/core';

const SERVICE_NAME = 'Appointment Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class AppointmentService extends BaseService implements IService {
  constructor(
    protected readonly databaseService: DatabaseService,
    @Inject(DiscoveryService)
    protected readonly discoveryService: DiscoveryService,
  ) {
    super(databaseService, discoveryService);
  }
  private readonly serviceName: string = SERVICE_NAME;
  protected getModel() {
    return this.databaseService.appointments;
  }

  protected getServiceName(): string {
    return this.serviceName;
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
