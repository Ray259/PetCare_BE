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
import { CreateHealthcareServiceDto } from '../dto/create/create-healthcare-service.dto';
import { UpdateHealthcareServiceDto } from '../dto/update/update-healthcare-service.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  GetHealthcareMedicineInterceptor,
  CreateOrUpdateHealthcareMedicineInterceptor,
} from './healthcare.interceptor';

@Controller('healthcare-service')
@ApiTags('Healthcare service')
export class HealthcareController {
  constructor(private readonly healthcareService: HealthcareService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  async create(@Body() dto: CreateHealthcareServiceDto) {
    return this.healthcareService.create(dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.healthcareService.findAll();
  }

  @Get(':id')
  @UseInterceptors(GetHealthcareMedicineInterceptor)
  @AuthUtils([Role.Admin, Role.User], 'access')
  findOne(@Param('id') id: string) {
    return this.healthcareService.findById(id);
  }

  @Get('all/pet=:id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findAllByPet(@Param('id') id: string) {
    return this.healthcareService.findAllByPet(id);
  }

  @Patch(':id')
  @UseInterceptors(CreateOrUpdateHealthcareMedicineInterceptor)
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Param('id') id: string, @Body() dto: UpdateHealthcareServiceDto) {
    return this.healthcareService.update(id, dto);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.healthcareService.remove(id);
  }
}
