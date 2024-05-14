import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardingService } from './boarding.service';
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';

@Controller('boarding-service')
export class BoardingServiceController {
  constructor(private readonly boardingService: BoardingService) {}

  @Post()
  @AuthUtils([Role.Admin, Role.User], 'access')
  create(@Body() dto: Prisma.BoardingServiceCreateInput) {
    return this.boardingService.create(dto);
  }

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.boardingService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findOne(@Param('id') id: string) {
    return this.boardingService.findById(id);
  }

  @Get('all/pet=:id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findAllByPet(@Param('id') id: string) {
    return this.boardingService.findAllByPet(id);
  }

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(
    @Param('id') id: string,
    @Body() dto: Prisma.BoardingServiceUpdateInput,
  ) {
    return this.boardingService.update(id, dto);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.boardingService.remove(id);
  }
}
