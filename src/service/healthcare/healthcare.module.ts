import { Module } from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { HealthcareController } from './healthcare.controller';
import { DiscoveryModule } from '@nestjs/core';
import { MedicineService } from 'src/medicine/medicine.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [HealthcareController],
  providers: [HealthcareService, MedicineService],
})
export class HealthcareServiceModule {}
