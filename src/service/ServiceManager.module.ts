import { Module } from '@nestjs/common';
import { ServiceManager } from './ServiceManager.service';

@Module({
  controllers: [ServiceManager],
  providers: [ServiceManager],
})
export class ServiceManagerModule {}
