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
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  create(@Body() createPetDto: Prisma.PetCreateInput) {
    return this.petsService.create(createPetDto);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin)
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id') id: string) {
    return this.petsService.findById(id);
  }

  @Get('all/owner=:id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  findAllByUser(@Param('id') id: string) {
    return this.petsService.findAllByUser(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  update(@Param('id') id: string, @Body() updatePetDto: Prisma.PetUpdateInput) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
