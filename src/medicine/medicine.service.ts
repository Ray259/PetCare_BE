import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Injectable()
export class MedicineService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createMedicineDto: CreateMedicineDto) {
    return this.databaseService.medicine.create({
      data: createMedicineDto,
    });
  }

  findAll() {
    return this.databaseService.medicine.findMany({});
  }

  async findByName(name: string) {
    return this.databaseService.medicine.findMany({
      where: { name },
    });
  }

  async findById(id: string) {
    return this.databaseService.medicine.findUnique({
      where: { id },
    });
  }
}
