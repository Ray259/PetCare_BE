import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { IService } from 'src/service/Base/IService';
import { BaseService } from 'src/service/Base/BaseService.service';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { DiscoveryService } from '@nestjs/core';
import { CreateAppointmentDto } from '../dto/create/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update/update-appointment.dto';

const SERVICE_NAME = 'Appointment Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class AppointmentService
  extends BaseService<CreateAppointmentDto, UpdateAppointmentDto>
  implements IService
{
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
}
