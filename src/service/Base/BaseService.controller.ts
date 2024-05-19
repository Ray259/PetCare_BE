import { Controller, Get, Query } from '@nestjs/common';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';
import { Role } from 'src/common/enums/role.enum';
import { BaseService } from './BaseService.service';

@Controller('services')
export class BaseServiceController extends BaseService {
  protected getModel() {
    throw new Error('Method not implemented.');
  }
  protected getServiceName(): string {
    throw new Error('Method not implemented.');
  }
  @Get('all-registered-services/pet')
  @AuthUtils([Role.Admin, Role.User], 'access')
  async findByPet(@Query('id') id: string) {
    return this.findRegisteredServices(id);
  }

  @Get('all-registered-services')
  @AuthUtils([Role.Admin], 'access')
  async findAll() {
    return this.getAllRegisteredServices();
  }

  @Get('test')
  async test() {
    const query = {
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
      },
    };
    const boarding = await this.databaseService.boardingService.findMany(query);
    const grooming = await this.databaseService.groomingService.findMany(query);
    const healthcare =
      await this.databaseService.healthcareService.findMany(query);
    const appointments =
      await this.databaseService.appointments.findMany(query);

    return [
      { serviceName: 'Boarding Service', services: boarding },
      { serviceName: 'Grooming Service', services: grooming },
      { serviceName: 'Healthcare Service', services: healthcare },
      { serviceName: 'Appointments', services: appointments },
    ];
  }
}
