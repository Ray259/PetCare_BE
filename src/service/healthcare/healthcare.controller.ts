import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';

@Controller('healthcare-service')
export class HealthcareController {
  constructor(private readonly healthcareService: HealthcareService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  create(@Body() dto: Prisma.HealthcareServiceCreateInput) {
    return this.healthcareService.create(dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.healthcareService.findAll();
  }

  @Get(':id')
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
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(
    @Param('id') id: string,
    @Body() dto: Prisma.HealthcareServiceUpdateInput,
  ) {
    return this.healthcareService.update(id, dto);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.healthcareService.remove(id);
  }
}
