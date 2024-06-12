import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from 'src/service/Base/BaseService.service';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { DiscoveryService } from '@nestjs/core';
import { CreateAppointmentDto } from 'src/service/dto/create/create-appointment.dto';
import { UpdateAppointmentDto } from 'src/service/dto/update/update-appointment.dto';
import { RevenueService } from 'src/revenue/revenue.service';

const SERVICE_NAME = 'Appointment Service';
const SERVICE_ENDPOINT = 'appointment-service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class AppointmentService extends BaseService<
  CreateAppointmentDto,
  UpdateAppointmentDto
> {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly revenueService: RevenueService,
    @Inject(DiscoveryService)
    protected readonly discoveryService: DiscoveryService,
  ) {
    super(databaseService, revenueService, discoveryService);
  }
  private readonly serviceName: string = SERVICE_NAME;
  private readonly serviceEndpoint: string = SERVICE_ENDPOINT;
  protected getModel() {
    return this.databaseService.appointments;
  }

  protected getServiceName(): string {
    return this.serviceName;
  }

  protected getServiceEndpoint(): string {
    return this.serviceEndpoint;
  }
}
