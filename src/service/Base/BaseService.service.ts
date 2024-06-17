import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { DatabaseService } from 'src/database/database.service';
import { getRegisteredServiceName } from 'src/common/decorator/service.decorator';
import { CreateDto } from 'src/service/dto/create/Create-Base.dto';
import { UpdateDto } from 'src/service/dto/update/Update-Base.dto';
import { ServiceStatus } from 'src/common/enums/service-status';
import { RevenueService } from 'src/revenue/revenue.service';

/**
 * Base service class providing common methods for all service classes
 * (create, update, find, remove, etc.).
 *
 * Service classes extending BaseService must implement the following methods:
 * - getModel(): any - Returns the model from the database service.
 * - getServiceName(): string - Returns the name of the service.
 * - getServiceEndpoint(): string - Returns the api endpoint of the service.
 *
 * @param T1 - The create DTO type.
 * @param T2 - The update DTO type.
 *
 *
 * @RegisterService  Extending classes also should implement the decorator in order to be included in certain service-related operations.
 */
@Injectable()
export abstract class BaseService<T1 extends CreateDto, T2 extends UpdateDto>
  implements OnModuleInit
{
  private registeredServices: { serviceName: string; model: any }[] = [];

  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly revenueService: RevenueService,
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
    const { petId, serviceId, ...data } = dto;
    return this.getModel().create({
      data: {
        ...data,
        pet: { connect: { id: petId } },
        service: { connect: { id: serviceId } },
      },
    });
  }

  async create(dto: T1) {
    const { petId, serviceId, ...data } = dto;
    return this.getModel().create({
      data: {
        ...data,
        pet: { connect: { id: petId } },
        service: { connect: { id: serviceId } },
      },
    });
  }

  async update(id: string, dto: T2) {
    if (dto.status === ServiceStatus.Completed) {
      await this.completeService(id);
    }
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

  async completeService(id: string) {
    const serviceName = this.getServiceName();
    const s = await this.databaseService.serviceDetails.findUnique({
      where: {
        serviceName,
      },
      select: {
        price: true,
      },
    });
    console.log(s, s.price);
    const a = await this.revenueService.update(serviceName, s.price);
    console.log(a);
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

  count() {
    return this.getModel().count();
  }

  async countAllRegisteredServices() {
    let count = 0;
    await Promise.all(
      this.registeredServices.map(async (service) => {
        const serviceCount = await service.model.count();
        count += serviceCount;
      }),
    );
    return count;
  }

  remove(id: string) {
    return this.getModel().delete({ where: { id } });
  }

  findAllByPet(petId: string) {
    return this.getModel().findMany({
      where: { petId },
    });
  }

  async findRegisteredServicesByPet(id: string) {
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

  getServiceDetails() {
    return this.databaseService.serviceDetails.findMany({});
  }
}
