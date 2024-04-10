import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
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
  @Get()
  findById(@Request() req) {
    const id = req.user.id;
    return this.usersService.findById(id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @Tokens('access')
  update(@Request() req, @Body() dto: Prisma.UserUpdateInput) {
    const id = req.user.id;
    return this.usersService.update(id, dto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Tokens('access')
  @Roles(['admin'])
  remove(@Request() req) {
    const id = req.params.id;
    return this.usersService.remove(id);
  }
}
