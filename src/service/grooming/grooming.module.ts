import { Module } from '@nestjs/common';
import { GroomingService } from './grooming.service';
import { GroomingServiceController } from './grooming.controller';
import { DiscoveryModule } from '@nestjs/core';
import { RevenueService } from 'src/revenue/revenue.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [GroomingServiceController],
  providers: [GroomingService, RevenueService],
})
export class GroomingServiceModule {}
