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
import { IServiceController } from 'src/service/Base/IServiceController';
import { IServiceApproval } from 'src/service/Base/IServiceApproval';

@Controller('grooming-service')
@ApiTags('Grooming Service')
export class GroomingServiceController
  implements IServiceController, IServiceApproval
{
  constructor(private readonly groomingService: GroomingService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  create(@Body() dto: CreateGroomingServiceDto) {
    return this.groomingService.create(dto);
  }

  @Post('create-base')
  @AuthUtils([Role.Admin, Role.User], 'access')
  createBase(@Body() dto: CreateGroomingServiceDto) {
    return this.groomingService.createBase(dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.groomingService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findById(@Param('id') id: string) {
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
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.groomingService.remove(id);
  }
}
