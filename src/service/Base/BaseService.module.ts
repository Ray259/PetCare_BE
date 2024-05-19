import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { BaseServiceController } from './BaseService.controller';
import { BaseService } from './BaseService.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [BaseServiceController],
  providers: [
    {
      provide: BaseService,
      useClass: BaseServiceController,
    },
  ],
  exports: [DiscoveryModule],
})
export class BaseServiceModule {}
