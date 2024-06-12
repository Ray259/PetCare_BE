import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RevenueService {
  constructor(private readonly databaseService: DatabaseService) {}

  private formatServiceName(serviceName: string) {
    return serviceName.replace(/-/g, ' ');
  }
  findAllRecords(serviceName?: string) {
    serviceName = this.formatServiceName(serviceName);
    console.log(serviceName);
    return this.databaseService.revenue.findMany({
      where:
        serviceName === 'all'
          ? {}
          : { serviceName: { equals: serviceName, mode: 'insensitive' } },
    });
  }

  getCurrentRevenue(serviceName?: string) {
    serviceName = this.formatServiceName(serviceName);
    return this.databaseService.revenue.findFirst({
      where:
        serviceName === 'all'
          ? {}
          : { serviceName: { equals: serviceName, mode: 'insensitive' } },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async update(serviceName: string, volume: any) {
    const r = await this.getCurrentRevenue(serviceName);
    const today = new Date();

    if (!r || !this.isSameDay(new Date(r.date), today)) {
      // If no revenue record exists or the date is not today, create
      return this.databaseService.revenue.create({
        data: {
          serviceName,
          total: volume,
          date: today,
        },
      });
    } else {
      // If revenue record exists and the date is today, update
      return this.databaseService.revenue.update({
        where: {
          id: r.id,
        },
        data: {
          total: {
            increment: volume,
          },
        },
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
}
