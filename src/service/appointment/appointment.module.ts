import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentServiceController } from './appointment.controller';

@Module({
  controllers: [AppointmentServiceController],
  providers: [AppointmentService],
})
export class PetsModule {}
