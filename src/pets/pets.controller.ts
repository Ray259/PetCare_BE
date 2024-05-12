import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  create(@Body() createPetDto: Prisma.PetCreateInput) {
    return this.petsService.create(createPetDto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findOne(@Param('id') id: string) {
    return this.petsService.findById(id);
  }

  @Get('all/owner=:id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findAllByUser(@Param('id') id: string) {
    return this.petsService.findAllByUser(id);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Param('id') id: string, @Body() updatePetDto: Prisma.PetUpdateInput) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
