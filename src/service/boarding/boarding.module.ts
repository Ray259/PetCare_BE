import { Module } from '@nestjs/common';
import { BoardingService } from './boarding.service';
import { BoardingServiceController } from './boarding.controller';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  controllers: [BoardingServiceController],
  providers: [BoardingService],
})
export class BoardingServiceModule {}
