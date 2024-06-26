import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Role } from 'src/common/enums/role.enum';
import { CreateAppointmentDto } from 'src/service/dto/create/create-appointment.dto';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { UpdateAppointmentDto } from 'src/service/dto/update/update-appointment.dto';
import { ApiTags } from '@nestjs/swagger';
import { IServiceController } from 'src/service/Interfaces/IServiceController';
import { IServiceApproval } from 'src/service/Interfaces/IServiceApproval';
import { CreateDto } from '../dto/create/Create-Base.dto';

@Controller('appointment-service')
@ApiTags('Appointments')
export class AppointmentServiceController
  implements IServiceController, IServiceApproval
{
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @AuthUtils([Role.Admin], 'access')
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Post('create-base')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  createBase(@Body() dto: CreateDto) {
    return this.appointmentService.createBase(dto);
  }

  @Get('count')
  @AuthUtils([Role.Admin], 'access')
  count() {
    return this.appointmentService.count();
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  findById(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Get('all/pet=:id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  findAllByPet(@Param('id') id: string) {
    return this.appointmentService.findAllByPet(id);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, dto);
  }

  @Patch('approve/:id')
  @AuthUtils([Role.Admin], 'access')
  approveService(@Param('id') id: string) {
    return this.appointmentService.approveService(id);
  }

  @Patch('reject/:id')
  @AuthUtils([Role.Admin], 'access')
  rejectService(@Param('id') id: string) {
    return this.appointmentService.rejectService(id);
  }

  @Patch('complete/:id')
  @AuthUtils([Role.Admin], 'access')
  completeService(@Param('id') id: string) {
    return this.appointmentService.completeService(id);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
