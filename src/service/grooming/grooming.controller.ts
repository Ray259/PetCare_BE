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
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';

@Controller('grooming-service')
export class GroomingServiceController {
  constructor(private readonly groomingService: GroomingService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  create(@Body() dto: Prisma.GroomingServiceCreateInput) {
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
  findAllByUser(@Param('id') id: string) {
    return this.groomingService.findAllByPet(id);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(
    @Param('id') id: string,
    @Body() dto: Prisma.GroomingServiceUpdateInput,
  ) {
    return this.groomingService.update(id, dto);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.groomingService.remove(id);
  }
}
