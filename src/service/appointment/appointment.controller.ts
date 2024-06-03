import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Role } from 'src/common/enums/role.enum';
import { CreateAppointmentDto } from '../dto/create/create-appointment.dto';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { UpdateAppointmentDto } from '../dto/update/update-appointment.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('appointment-service')
@ApiTags('Appointments')
export class AppointmentServiceController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  create(@Body() dto: CreateAppointmentDto, @Request() req) {
    const role = req.user.role;
    return this.appointmentService.create(role, dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Get('all/pet=:id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findAllByPet(@Param('id') id: string) {
    return this.appointmentService.findAllByPet(id);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, dto);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin], 'access')
  approve(@Param('id') id: string) {
    return this.appointmentService.approveService(id);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
