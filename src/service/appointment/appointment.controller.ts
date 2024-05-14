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
import { AppointmentService } from './appointment.service';
import { Prisma } from '@prisma/client';
import { Tokens } from 'src/common/decorator/tokens.decorator';
import { AuthGuard } from 'src/auth/Guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('appointment-service')
export class AppointmentServiceController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  create(@Body() dto: Prisma.AppointmentsCreateInput) {
    return this.appointmentService.create(dto);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin)
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Get('all/pet=:id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  findAllByPet(@Param('id') id: string) {
    return this.appointmentService.findAllByPet(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  update(@Param('id') id: string, @Body() dto: Prisma.AppointmentsUpdateInput) {
    return this.appointmentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
