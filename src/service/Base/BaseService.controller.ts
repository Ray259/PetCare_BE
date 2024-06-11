import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { Role } from 'src/common/enums/role.enum';
import { BaseService } from './BaseService.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateDto } from 'src/service/dto/create/Create-Base.dto';

@Controller('services')
@ApiTags('Base service')
export class BaseServiceController extends BaseService<any, any> {
  protected getModel() {
    return 'Base Service';
  }
  protected getServiceName(): string {
    return 'Base Service';
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

  @Post('create-base-service')
  @AuthUtils([Role.Admin, Role.User], 'access')
  async createBaseService(@Body() dto: CreateDto) {
    return this.createBase(dto);
  }

  @Get('our-services')
  ourService() {
    return this.getListAllService();
  }
}
