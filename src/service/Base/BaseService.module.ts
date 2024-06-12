import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { BaseServiceController } from './BaseService.controller';
import { BaseService } from './BaseService.service';
import { RevenueService } from 'src/revenue/revenue.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [BaseServiceController],
  providers: [
    {
      provide: BaseService,
      useClass: BaseServiceController,
    },
    RevenueService,
  ],
  exports: [DiscoveryModule],
})
export class BaseServiceModule {}
