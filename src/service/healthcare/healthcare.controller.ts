import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { Prisma } from '@prisma/client';
import { Tokens } from 'src/common/decorator/tokens.decorator';
import { AuthGuard } from 'src/auth/Guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('healthcare-service')
export class HealthcareController {
  constructor(private readonly healthcareService: HealthcareService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  create(@Body() dto: Prisma.HealthcareServiceCreateInput) {
    return this.healthcareService.create(dto);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin)
  findAll() {
    return this.healthcareService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id') id: string) {
    return this.healthcareService.findById(id);
  }

  @Get('all/pet=:id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  findAllByUser(@Param('id') id: string) {
    return this.healthcareService.findAllByUser(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  update(@Param('id') id: string, @Body() updatePetDto: Prisma.PetUpdateInput) {
    return this.healthcareService.update(id, updatePetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  remove(@Param('id') id: string) {
    return this.healthcareService.remove(id);
  }
}
