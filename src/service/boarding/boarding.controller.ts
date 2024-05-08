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
import { BoardingService } from './boarding.service';
import { Prisma } from '@prisma/client';
import { Tokens } from 'src/common/decorator/tokens.decorator';
import { AuthGuard } from 'src/auth/Guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('boarding-service')
export class BoardingServiceController {
  constructor(private readonly boardingService: BoardingService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  create(@Body() dto: Prisma.BoardingServiceCreateInput) {
    return this.boardingService.create(dto);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin)
  findAll() {
    return this.boardingService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id') id: string) {
    return this.boardingService.findById(id);
  }

  @Get('all/pet=:id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  findAllByUser(@Param('id') id: string) {
    return this.boardingService.findAllByPet(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  update(
    @Param('id') id: string,
    @Body() dto: Prisma.BoardingServiceUpdateInput,
  ) {
    return this.boardingService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(Role.Admin, Role.User)
  remove(@Param('id') id: string) {
    return this.boardingService.remove(id);
  }
}
