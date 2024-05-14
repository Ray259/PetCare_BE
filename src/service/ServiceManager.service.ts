import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';
import { Role } from 'src/common/enums/role.enum';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
@Controller('services')
export class ServiceManager {
  constructor(private readonly databaseService: DatabaseService) {}

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
}
