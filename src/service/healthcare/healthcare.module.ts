import { Module } from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { HealthcareController } from './healthcare.controller';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  controllers: [HealthcareController],
  providers: [HealthcareService],
})
export class HealthcareServiceModule {}
