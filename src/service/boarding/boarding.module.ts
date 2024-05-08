import { Module } from '@nestjs/common';
import { BoardingService } from './boarding.service';
import { BoardingServiceController } from './boarding.controller';

@Module({
  controllers: [BoardingServiceController],
  providers: [BoardingService],
})
export class BoardingServiceModule {}
