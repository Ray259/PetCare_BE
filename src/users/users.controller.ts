import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { Tokens } from 'src/common/decorator/tokens.decorator';
import { AuthGuard } from 'src/auth/Guard/jwt-auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/Guard/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-all')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(['admin'])
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Tokens('access')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Prisma.UserUpdateInput) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
