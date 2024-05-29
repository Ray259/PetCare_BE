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

  findAll() {
    return this.getModel().findMany({});
  }

  remove(id: string) {
    return this.getModel().delete({ where: { id } });
  }

  findAllByPet(petId: string) {
    return this.getModel().findMany({
      where: { petId },
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

  getListAllService() {
    return Promise.all(
      this.registeredServices.map(async (service) => {
        return service.serviceName;
      }),
    );
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
        return { serviceName: service.serviceName, services };
      }),
    );
    return results;
  }
}
