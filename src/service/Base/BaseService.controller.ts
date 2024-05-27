import { Controller, Get, Query } from '@nestjs/common';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { Role } from 'src/common/enums/role.enum';
import { BaseService } from './BaseService.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('services')
@ApiTags('Base service')
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
  async findAllService() {
    return this.getAllRegisteredServices();
  }
}
