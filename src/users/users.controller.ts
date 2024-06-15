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
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @AuthUtils([Role.Admin], 'access')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('number')
  @AuthUtils([Role.Admin], 'access')
  count() {
    return this.usersService.count();
  }

  @Get('client-number')
  @AuthUtils([Role.Admin], 'access')
  countClient() {
    return this.usersService.countClient();
  }

  @Get()
  @AuthUtils([Role.Admin, Role.User], 'access')
  @UseInterceptors(UserInterceptor)
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

  @Patch(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @AuthUtils([Role.Admin, Role.User], 'access')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
