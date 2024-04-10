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
import { AuthGuard } from './Guard/jwt-auth.guard';
import { Tokens } from '../common/decorator/tokens.decorator';
import { Response } from 'express';
import { GoogleOauthGuard } from './Guard/google-oauth.guard';

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

  @UseGuards(AuthGuard)
  @Tokens('refresh')
  @Get('refresh')
  refreshToken(@Request() req) {
    const user = req.user;
    // console.log(user);
    return this.authService.refresh(user.id, user.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Tokens('refresh')
  @Get('logout')
  logout(@Request() req) {
    const user = req.user;
    return this.authService.logout(user.id, user.refreshToken);
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
