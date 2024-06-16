import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RevenueService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllRecords(serviceName?: string) {
    const serviceDetailsId =
      serviceName && serviceName !== 'all'
        ? await this.getServiceDetailsId(serviceName)
        : undefined;

    return this.databaseService.revenue.findMany({
      where: serviceDetailsId ? { serviceId: serviceDetailsId } : {},
    });
  }

  getLastUpdateTimestamp() {
    return this.databaseService.revenue.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });
  }

  async getCurrentRevenue(serviceName?: string) {
    if (serviceName === 'all' || !serviceName) {
      return this.getTotalRevenueForAllServices();
    }

    const serviceDetailsId = await this.getServiceDetailsId(serviceName);
    return this.databaseService.revenue.findFirst({
      where: { serviceId: serviceDetailsId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  private async getTotalRevenueForAllServices() {
    const serviceDetails = await this.databaseService.serviceDetails.findMany({
      select: { id: true },
    });

    const recentRevenues = await Promise.all(
      serviceDetails.map(async (service) =>
        this.databaseService.revenue.findFirst({
          where: { serviceId: service.id },
          orderBy: { updatedAt: 'desc' },
        }),
      ),
    );

    const validRevenues = recentRevenues.filter(Boolean);
    const total = validRevenues.reduce(
      (sum, revenue) => sum + revenue.total,
      0,
    );

    return { id: 'all', total, date: new Date() };
  }

  async getYesterdayGrowth(serviceName?: string) {
    const formattedServiceName = this.formatServiceName(serviceName);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayRevenue = await this.getCurrentRevenue(formattedServiceName);
    const serviceDetailsId =
      await this.getServiceDetailsId(formattedServiceName);

    const yesterdayRevenues = await this.databaseService.revenue.findMany({
      where: {
        serviceId: serviceDetailsId,
        date: {
          gte: this.getStartOfDay(yesterday),
          lt: this.getStartOfDay(today),
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const yesterdayRevenue = yesterdayRevenues.find((revenue) =>
      this.isSameDay(revenue.date, yesterday),
    );

    const yesterdayTotal = yesterdayRevenue ? yesterdayRevenue.total : 0;
    return todayRevenue ? todayRevenue.total - yesterdayTotal : 0;
  }

  async getYesterdayTotalGrowth() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayTotalRevenue = await this.getTotalRevenueForAllServices();
    const yesterdayRevenues = await this.databaseService.revenue.findMany({
      where: {
        date: {
          gte: this.getStartOfDay(yesterday),
          lt: this.getStartOfDay(today),
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const yesterdayRevenue = yesterdayRevenues.find((revenue) =>
      this.isSameDay(revenue.date, yesterday),
    );

    const yesterdayTotal = yesterdayRevenue ? yesterdayRevenue.total : 0;
    return todayTotalRevenue.total - yesterdayTotal;
  }

  async update(serviceName: string, volume: number) {
    const today = new Date();
    const currentRevenue = await this.getCurrentRevenue(serviceName);
    const serviceDetailsId = await this.getServiceDetailsId(serviceName);

    if (
      !currentRevenue ||
      !this.isSameDay(new Date(currentRevenue.date), today)
    ) {
      return this.databaseService.revenue.create({
        data: {
          serviceId: serviceDetailsId,
          total: volume,
          date: today,
        },
      });
    }

    return this.databaseService.revenue.update({
      where: { id: currentRevenue.id },
      data: { total: { increment: volume } },
    });
  }

  // Helper methods
  private formatServiceName(serviceName: string): string {
    return serviceName.replace(/-/g, ' ');
  }

  private async getServiceDetailsId(serviceName: string): Promise<string> {
    const formattedServiceName = this.formatServiceName(serviceName);
    const serviceDetails = await this.databaseService.serviceDetails.findFirst({
      where: {
        serviceName: { equals: formattedServiceName, mode: 'insensitive' },
      },
      select: { id: true },
    });

    return serviceDetails.id;
  }

  private getStartOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
}
