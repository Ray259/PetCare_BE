import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentServiceController } from './appointment.controller';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  controllers: [AppointmentServiceController],
  providers: [AppointmentService],
})
export class AppointmentServiceModule {}
