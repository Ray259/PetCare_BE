import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { DatabaseService } from 'src/database/database.service';
import { getRegisteredServiceName } from 'src/common/decorator/service.decorator';
import { CreateDto } from 'src/service/dto/create/Create-Base.dto';
import { UpdateDto } from 'src/service/dto/update/Update-Base.dto';
import { ServiceStatus } from 'src/common/enums/service-status';

/**
 * Base service providing common methods for all services (update, create, find, remove).

 *
 * Extended classes must provide the following methods:
 * - getModel(): any (returning the model from the database service)
 * - getServiceName(): string (returning the service name)
 */
@Injectable()
export abstract class BaseService<T1 extends CreateDto, T2 extends UpdateDto>
  implements OnModuleInit
{
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

  createBase(dto: CreateDto) {
    return this.getModel().create({
      data: { petId: dto.petId, date: dto.date },
    });
  }

  async create(dto: T1) {
    const { petId, ...data } = dto;
    return this.getModel().create({
      data: {
        ...data,
        pet: { connect: { id: petId } },
      },
    });
  }

  update(id: string, dto: T2) {
    return this.getModel().update({
      where: {
        id,
      },
      data: dto,
    });
  }

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

  approveService(id: string) {
    return this.getModel().update({
      where: { id },
      data: { status: ServiceStatus.Approved },
    });
  }

  completeService(id: string) {
    return this.getModel().update({
      where: { id },
      data: { status: ServiceStatus.Completed },
    });
  }

  rejectService(id: string) {
    return this.getModel().update({
      where: { id },
      data: { status: ServiceStatus.Rejected },
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

  getPriceList() {
    return this.databaseService.serviceDetails.findMany({});
  }
}
