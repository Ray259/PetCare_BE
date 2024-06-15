import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateHealthcareServiceDto } from 'src/service/dto/create/create-healthcare-service.dto';
import { UpdateHealthcareServiceDto } from 'src/service/dto/update/update-healthcare-service.dto';
import {
  GetHealthcareMedicineInterceptor,
  CreateOrUpdateHealthcareMedicineInterceptor,
} from './healthcare.interceptor';
import { RequestType } from 'src/common/enums/request-type.enum';
import { RequestTypes } from 'src/common/decorator/request-type.decorator';
import { IServiceApproval } from 'src/service/Interfaces/IServiceApproval';
import { IServiceController } from 'src/service/Interfaces/IServiceController';

@Controller('healthcare-service')
@ApiTags('Healthcare service')
export class HealthcareController
  implements IServiceController, IServiceApproval
{
  constructor(private readonly healthcareService: HealthcareService) {}

  @Post()
  @RequestTypes(RequestType.Create)
  @UseInterceptors(CreateOrUpdateHealthcareMedicineInterceptor)
  @AuthUtils([Role.Admin, Role.User], 'access')
  async create(@Body() dto: CreateHealthcareServiceDto) {
    return this.healthcareService.create(dto);
  }

  @Post('create-base')
  @AuthUtils([Role.Admin, Role.User], 'access')
  createBase(@Body() dto: CreateHealthcareServiceDto) {
    return this.healthcareService.createBase(dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.healthcareService.findAll();
  }

  @Get(':id')
  @UseInterceptors(GetHealthcareMedicineInterceptor)
  @AuthUtils([Role.Admin, Role.User], 'access')
  findById(@Param('id') id: string) {
    return this.healthcareService.findById(id);
  }

  @Get('all/pet=:id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findAllByPet(@Param('id') id: string) {
    return this.healthcareService.findAllByPet(id);
  }

  @Patch(':id')
  @RequestTypes(RequestType.Update)
  @UseInterceptors(CreateOrUpdateHealthcareMedicineInterceptor)
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Param('id') id: string, @Body() dto: UpdateHealthcareServiceDto) {
    return this.healthcareService.update(id, dto);
  }

  @Patch('approve/:id')
  @AuthUtils([Role.Admin], 'access')
  approveService(@Param('id') id: string) {
    return this.healthcareService.approveService(id);
  }

  @Patch('reject/:id')
  @AuthUtils([Role.Admin], 'access')
  rejectService(@Param('id') id: string) {
    return this.healthcareService.rejectService(id);
  }

  @Patch('complete/:id')
  @AuthUtils([Role.Admin], 'access')
  completeService(@Param('id') id: string) {
    return this.healthcareService.completeService(id);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.healthcareService.remove(id);
  }
}
