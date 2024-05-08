import { Module } from '@nestjs/common';
import { GroomingService } from './grooming.service';
import { GroomingServiceController } from './grooming.controller';

@Module({
  controllers: [GroomingServiceController],
  providers: [GroomingService],
})
export class PetsModule {}
