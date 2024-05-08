import { Module } from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { HealthcareController } from './healthcare.controller';

@Module({
  controllers: [HealthcareController],
  providers: [HealthcareService],
})
export class HealthcareServiceModule {}
