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

  async getYesterdayGrowth(serviceName?: string) {
    serviceName = this.formatServiceName(serviceName);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const todayRevenue = await this.getCurrentRevenue(serviceName);
    const yesterdayRevenue = await this.databaseService.revenue.findFirst({
      where:
        serviceName === 'all'
          ? {
              date: {
                equals: yesterday,
              },
            }
          : {
              serviceName: { equals: serviceName, mode: 'insensitive' },
              date: {
                equals: yesterday,
              },
            },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    if (!yesterdayRevenue) {
      return todayRevenue.total;
    }
    return todayRevenue.total - yesterdayRevenue.total;
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

  private isYesterday(today: Date, date: Date): boolean {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return this.isSameDay(date, yesterday);
  }
}
