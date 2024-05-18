import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';
import { Role } from 'src/common/enums/role.enum';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
@Controller('services')
export abstract class BaseService {
  constructor(protected readonly databaseService: DatabaseService) {}

  protected abstract getModel(): any;
  protected abstract getServiceName(): string;

  findById(id: string) {
    return this.getModel()
      .findUnique({
        where: { id },
        include: { pet: true },
      })
      .then((res: any) => {
        res.serviceName = this.getServiceName();
        return res;
      });
  }

  @Get('all-registered-services/pet')
  @AuthUtils([Role.Admin, Role.User], 'access')
  async findRegisteredServices(@Query('id') id: string) {
    console.log(id);
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

  @Get('all-registered-services')
  @AuthUtils([Role.Admin], 'access')
  async getAllRegisteredServices() {
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
