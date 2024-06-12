import { Module } from '@nestjs/common';
import { BoardingService } from './boarding.service';
import { BoardingServiceController } from './boarding.controller';
import { DiscoveryModule } from '@nestjs/core';
import { RevenueService } from 'src/revenue/revenue.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [BoardingServiceController],
  providers: [BoardingService, RevenueService],
})
export class BoardingServiceModule {}
