import { Controller, Get, Query } from '@nestjs/common';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { Role } from 'src/common/enums/role.enum';
import { BaseService } from './BaseService.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('services')
@ApiTags('Base service')
export class BaseServiceController extends BaseService<any, any> {
  @Get('all-registered-services/pet')
  @AuthUtils([Role.Admin, Role.User], 'access')
  async findByPet(@Query('id') id: string) {
    return this.findRegisteredServicesByPet(id);
  }

  @Get('all-registered-services-number')
  @AuthUtils([Role.Admin], 'access')
  async findRegisteredServicesNumber() {
    return this.countAllRegisteredServices();
  }

  @Get('all-registered-services')
  @AuthUtils([Role.Admin], 'access')
  async findAllService() {
    return this.getAllRegisteredServices();
  }

  @Get('our-services')
  ourService() {
    return this.getListAllService();
  }

  @Get('service-details')
  serviceDetails() {
    return this.getServiceDetails();
  }

  protected getModel() {
    return this;
  }
  protected getServiceName(): string {
    return 'Base Service';
  }
}
