import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RevenueService } from './revenue.service';

@Controller('revenue')
@ApiTags('Revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get(':serviceName')
  findByService(@Param('serviceName') serviceName: string) {
    return this.revenueService.getCurrentRevenue(serviceName);
  }

  @Get('history/:serviceName')
  findAll(@Param('serviceName') serviceName: string) {
    return this.revenueService.findAllRecords(serviceName);
  }
}
