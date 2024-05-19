import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { DatabaseService } from 'src/database/database.service';
import { getRegisteredServiceName } from 'src/common/decorator/service.decorator';

@Injectable()
export abstract class BaseService implements OnModuleInit {
  private registeredServices: { serviceName: string; model: any }[] = [];

  constructor(
    protected readonly databaseService: DatabaseService,
    @Inject(DiscoveryService)
    protected readonly discoveryService: DiscoveryService,
  ) {}

  onModuleInit() {
    const providers = this.discoveryService.getProviders();
    providers.forEach((provider) => {
      const serviceName = getRegisteredServiceName(provider.metatype);
      if (serviceName) {
        const instance = provider.instance;
        const model = instance.getModel?.();
        if (model) {
          this.registeredServices.push({ serviceName, model });
        }
      }
    });
  }

  protected abstract getModel(): any;
  protected abstract getServiceName(): string;

  findById(id: string) {
    return this.getModel()
      .findUnique({
        where: { id },
        include: { pet: true },
      })
      .then((res: any) => {
        res.serviceName = this.getServiceName();
        return res;
      });
  }

  async findRegisteredServices(id: string) {
    const results = await Promise.all(
      this.registeredServices.map(async (service) => {
        const services = await service.model.findMany({
          where: { petId: id },
        });
        return { serviceName: service.serviceName, services };
      }),
    );
    return results;
  }

  async getAllRegisteredServices() {
    const query = {
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
      },
    };
    const results = await Promise.all(
      this.registeredServices.map(async (service) => {
        const services = await service.model.findMany(query);
        console.log(service.serviceName, services.length > 0 ? 1 : 0);
        return { serviceName: service.serviceName, services };
      }),
    );
    console.log('///');
    return results;
  }
}
