import { Module } from '@nestjs/common';
import { HealthcareServiceModule } from 'src/service/healthcare/healthcare.module';
import { GroomingServiceModule } from 'src/service/grooming/grooming.module';
import { AppointmentServiceModule } from 'src/service/appointment/appointment.module';
import { BoardingServiceModule } from 'src/service/boarding/boarding.module';

@Module({
  imports: [
    HealthcareServiceModule,
    GroomingServiceModule,
    AppointmentServiceModule,
    BoardingServiceModule,
  ],
})
export class ServiceModule {}
