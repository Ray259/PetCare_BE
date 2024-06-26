import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { PetInterceptor } from './pets.interceptor';
import { CreatePetDto } from './dto/create-pet.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('pets')
@ApiTags('Pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.Client], 'access')
  @UseInterceptors(PetInterceptor)
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.petsService.findAll();
  }

  @Get('number')
  @AuthUtils([Role.Admin], 'access')
  count() {
    return this.petsService.count();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  findOne(@Param('id') id: string) {
    return this.petsService.findById(id);
  }

  @Get('all/owner=:id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  findAllByUser(@Param('id') id: string) {
    return this.petsService.findAllByUser(id);
  }

  @Patch(':id')
  @UseInterceptors(PetInterceptor)
  @AuthUtils([Role.Admin, Role.Client], 'access')
  update(@Param('id') id: string, @Body() updatePetDto: Prisma.PetUpdateInput) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.Client], 'access')
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
