import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseService } from '../Base/BaseService.service';
import { IService } from '../Base/IService';
import { DiscoveryService } from '@nestjs/core';
import { RegisterService } from 'src/common/decorator/service.decorator';
import { CreateHealthcareServiceDto } from '../dto/create/create-healthcare-service.dto';
import { CreateMedicineDto } from 'src/medicine/dto/create-medicine.dto';
import { UpdateHealthcareServiceDto } from '../dto/update/update-healthcare-service.dto';

const SERVICE_NAME = 'Healthcare Service';

@Injectable()
@RegisterService(SERVICE_NAME)
export class HealthcareService extends BaseService implements IService {
  constructor(
    protected readonly databaseService: DatabaseService,
    @Inject(DiscoveryService)
    protected readonly discoveryService: DiscoveryService,
  ) {
    super(databaseService, discoveryService);
  }
  private readonly serviceName: string = SERVICE_NAME;
  protected getModel() {
    return this.databaseService.healthcareService;
  }

  protected getServiceName(): string {
    return this.serviceName;
  }

  async create(dto: CreateHealthcareServiceDto) {
    let medicineId: string | undefined;
    if (dto.medicine) {
      const medicine = await this.databaseService.medicine.findMany({
        where: { name: dto.medicine },
      });
      if (medicine.length > 0) {
        medicineId = medicine[0].id;
      } else {
        medicineId = await this.createMedicine(dto.medicine);
      }
    }

    return this.databaseService.healthcareService.create({
      data: {
        petId: dto.petId,
        description: dto.description,
        diet: dto.diet,
        date: dto.date,
        medicine: medicineId ? [medicineId] : undefined,
        additionalInfo: dto.additionalInfo,
      },
    });
  }

  private async createMedicine(name: string): Promise<string> {
    const newMedicineDto: CreateMedicineDto = {
      name: name,
      description: '',
    };
    const createdMedicine = await this.databaseService.medicine.create({
      data: newMedicineDto,
    });
    return createdMedicine.id;
  }

  findAll() {
    return this.databaseService.healthcareService.findMany({});
  }

  findById(id: string) {
    return this.databaseService.healthcareService
      .findUnique({
        where: { id },
        include: { pet: true },
      })
      .then((res: any) => {
        res.serviceName = this.serviceName;
        return res;
      });
  }

  findAllByPet(petId: string) {
    return this.databaseService.healthcareService.findMany({
      where: { petId },
    });
  }

  async update(id: string, dto: UpdateHealthcareServiceDto) {
    let medicineIds: string[] | undefined;
    if (dto.medicine && dto.medicine.length > 0) {
      medicineIds = [];
      for (const medName of dto.medicine) {
        const medicines = await this.databaseService.medicine.findMany({
          where: {
            name: medName,
          },
        });

        if (medicines.length > 0) {
          medicineIds.push(medicines[0].id);
        } else {
          const createdMedicineId = await this.createMedicine(medName);
          medicineIds.push(createdMedicineId);
        }
      }
    }

    return this.databaseService.healthcareService.update({
      where: {
        id,
      },
      data: {
        description: dto.description,
        diet: dto.diet,
        date: dto.date,
        medicine: medicineIds ? { set: medicineIds } : undefined,
        additionalInfo: dto.additionalInfo,
      },
    });
  }

  remove(id: string) {
    return this.databaseService.healthcareService.delete({ where: { id } });
  }
}
