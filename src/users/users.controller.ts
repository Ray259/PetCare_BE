import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  Delete,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from 'src/common/enums/role.enum';
import { AuthUtils } from 'src/utils/decorator/auth-utils.decorator';
import { UserInterceptor } from './users.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.usersService.findAll();
  }

  @Get()
  @AuthUtils([Role.Admin, Role.User], 'access')
  find(@Request() req) {
    const id = req.user.id;
    return this.usersService.findById(id);
  }

  @Get(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  @UseInterceptors(UserInterceptor)
  findById(@Request() req, @Param('id') id: string) {
    // const requestId = req.user.id;
    console.log('id', id);
    return this.usersService.findById(id);
  }

  @Patch()
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Request() req, @Body() dto: UpdateUserDto) {
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
