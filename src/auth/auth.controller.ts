import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Tokens } from '../common/decorator/tokens.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  create(@Body() dto: Prisma.UserCreateInput) {
    return this.usersService.create(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Tokens('access')
  @Get('logout')
  logout(@Request() req) {
    const user = req.user;
    console.log('user', user.id);
    return this.authService.logout(user.id);
  }

  @UseGuards(AuthGuard)
  @Tokens('refresh')
  @Get('refresh')
  refreshToken(@Request() req) {
    const user = req.user;
    console.log(user);
    return this.authService.refresh(user.id, user.refreshToken);
  }
}
