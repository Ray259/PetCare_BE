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
import { ApiTags } from '@nestjs/swagger';
import { CreateGroomingServiceDto } from 'src/service/dto/create/create-grooming-service.dto';
import { UpdateGroomingServiceDto } from 'src/service/dto/update/update-grooming-service.dto';
import { IServiceController } from 'src/service/Interfaces/IServiceController';
import { IServiceApproval } from 'src/service/Interfaces/IServiceApproval';
import { CreateDto } from '../dto/create/Create-Base.dto';

@Controller('grooming-service')
@ApiTags('Grooming Service')
export class GroomingServiceController
  implements IServiceController, IServiceApproval
{
  constructor(private readonly groomingService: GroomingService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.Client], 'access')
  create(@Body() dto: CreateGroomingServiceDto) {
    return this.groomingService.create(dto);
  }

  @Post('create-base')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  createBase(@Body() dto: CreateDto) {
    return this.groomingService.createBase(dto);
  }

  @Get('count')
  @AuthUtils([Role.Admin], 'access')
  count() {
    return this.groomingService.count();
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.groomingService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  findById(@Param('id') id: string) {
    return this.groomingService.findById(id);
  }

  @Get('all/pet=:id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  findAllByPet(@Param('id') id: string) {
    return this.groomingService.findAllByPet(id);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  update(@Param('id') id: string, @Body() dto: UpdateGroomingServiceDto) {
    return this.groomingService.update(id, dto);
  }

  @Patch('approve/:id')
  @AuthUtils([Role.Admin], 'access')
  approveService(@Param('id') id: string) {
    return this.groomingService.approveService(id);
  }

  @Patch('reject/:id')
  @AuthUtils([Role.Admin], 'access')
  rejectService(@Param('id') id: string) {
    return this.groomingService.rejectService(id);
  }

  @Patch('complete/:id')
  @AuthUtils([Role.Admin], 'access')
  completeService(@Param('id') id: string) {
    return this.groomingService.completeService(id);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  remove(@Param('id') id: string) {
    return this.groomingService.remove(id);
  }
}
