import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Get(':name')
  async findByName(@Param('name') name: string) {
    return this.medicineService.findByName(name);
  }

  @Get('id/:id')
  async findById(@Param('id') id: string) {
    return this.medicineService.findById(id);
  }
}
