import { Module } from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { HealthcareController } from './healthcare.controller';
import { DiscoveryModule } from '@nestjs/core';
import { MedicineService } from 'src/medicine/medicine.service';
import { RevenueService } from 'src/revenue/revenue.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [HealthcareController],
  providers: [HealthcareService, MedicineService, RevenueService],
})
export class HealthcareServiceModule {}
