import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { Prisma } from '@prisma/client';
import { Tokens } from 'src/common/decorator/tokens.decorator';
import { AuthGuard } from 'src/auth/Guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guard/roles.guard';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  create(@Body() createPetDto: Prisma.PetCreateInput) {
    return this.petsService.create(createPetDto);
  }

  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: Prisma.PetUpdateInput) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
