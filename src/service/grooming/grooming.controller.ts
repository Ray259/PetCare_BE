import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroomingService } from './grooming.service';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { CreateGroomingServiceDto } from '../Dto/create/create-grooming-service.dto';
import { UpdateGroomingServiceDto } from '../Dto/update/update-grooming-service.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('grooming-service')
@ApiTags('Grooming Service')
export class GroomingServiceController {
  constructor(private readonly groomingService: GroomingService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  create(@Body() dto: CreateGroomingServiceDto) {
    return this.groomingService.create(dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.groomingService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findOne(@Param('id') id: string) {
    return this.groomingService.findById(id);
  }

  @Get('all/pet=:id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findAllByPet(@Param('id') id: string) {
    return this.groomingService.findAllByPet(id);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Param('id') id: string, @Body() dto: UpdateGroomingServiceDto) {
    return this.groomingService.update(id, dto);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.groomingService.remove(id);
  }
}
