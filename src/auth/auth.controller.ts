import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { GoogleOauthGuard } from './Guard/google-oauth.guard';
import { AuthUtils } from 'src/common/decorator/group/auth-utils.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() dto: Prisma.UserCreateInput) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.authService.login(dto);
    // console.log(payload);
    res.cookie('access_token', JSON.stringify(payload.access_token));
    res.cookie('refresh_token', JSON.stringify(payload.refresh_token));
    return payload;
  }

  @Get('refresh')
  @AuthUtils([Role.Admin, Role.User], 'refresh')
  async refreshToken(@Request() req) {
    const user = req.user;
    const tokens = await this.authService.refresh(user.id, user.refreshToken);
    return tokens;
  }

  @Get('logout')
  @AuthUtils([Role.Admin, Role.User], 'refresh')
  logout(@Request() req) {
    const user = req.user;
    return this.authService.logout(user.id, user.refreshToken);
  }

  @AuthUtils([Role.Admin, Role.User], 'refresh')
  logoutAll(@Request() req) {
    const user = req.user;
    return this.authService.logoutAll(user.id);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
}
