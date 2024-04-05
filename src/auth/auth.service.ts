import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/token.type';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: Prisma.UserCreateInput) {
    return this.usersService.create(dto);
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException("Email hasn't been registered");
    if (!this.comparePassword(dto.password, user.password)) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const tokens = await this.createTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async googleLogin(req): Promise<Tokens> {
    await this.register({
      id: req.user.id,
      email: req.user.email,
      username: req.user.name,
      avatar: req.user.avatar,
      password: '',
      phone: '',
    });
    return this.createTokens(req.id, req.email);
  }

  async logout(id: string) {
    await this.databaseService.user.updateMany({
      where: {
        id: id,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refresh(id: string, rt: string): Promise<Tokens> {
    const user = await this.databaseService.user.findUnique({
      where: { id: id },
    });
    if (!user) throw new ForbiddenException();
    if (!bcrypt.compare(rt, user.refreshToken)) throw new ForbiddenException();
    const tokens = await this.createTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  // func
  async storeRefreshToken(id: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.databaseService.user.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: hash,
      },
    });
  }

  async createTokens(id: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { email, id },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        { id },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }
}
