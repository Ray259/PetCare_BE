import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  findById(@Request() req, @Param('id') id: string) {
    // const requestId = req.user.id;
    console.log('id', id);
    return this.usersService.findById(id);
  }

  @Patch()
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Request() req, @Body() dto: Prisma.UserUpdateInput) {
    const id = req.user.id;
    return this.usersService.update(id, dto);
  }

  @Delete()
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Request() req) {
    const id = req.params.id;
    return this.usersService.remove(id);
  }
}
