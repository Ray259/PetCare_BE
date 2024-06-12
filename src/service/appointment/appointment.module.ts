import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentServiceController } from './appointment.controller';
import { DiscoveryModule } from '@nestjs/core';
import { RevenueService } from 'src/revenue/revenue.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [AppointmentServiceController],
  providers: [AppointmentService, RevenueService],
})
export class AppointmentServiceModule {}
