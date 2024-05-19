import { Module } from '@nestjs/common';
import { GroomingService } from './grooming.service';
import { GroomingServiceController } from './grooming.controller';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  controllers: [GroomingServiceController],
  providers: [GroomingService],
})
export class GroomingServiceModule {}
