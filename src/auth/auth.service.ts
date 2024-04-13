import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
import { Tokens } from './types/token.type';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Prisma } from '@prisma/client';
import { GGProfile } from './types/ggprofile.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async register(dto: Prisma.UserCreateInput) {
    return this.usersService.create(dto);
  }

  async registerByGoogle(dto: GGProfile) {
    return this.databaseService.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        avatar: dto.avatar,
        password: null,
        phone: null,
      },
    });
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException("Email hasn't been registered");
    if (!this.comparePassword(dto.password, user.password)) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const tokens = await this.createTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async googleLogin(req): Promise<Tokens> {
    const user: GGProfile = req.user;
    await this.registerByGoogle(user);
    return this.createTokens(req.id, req.email);
  }

  async logout(id: string, rt: string) {
    const user = await this.usersService.findById(id);
    if (user && user.refreshToken.includes(rt)) {
      user.refreshToken.map((i) => (i === rt ? null : i));
      await this.databaseService.user.update({
        where: { id: user.id },
        data: user,
      });
    }
  }

  async refresh(id: string, rt: string): Promise<Tokens> {
    if (!(await this.validateToken(id, rt))) this.sendSecurityAlert(); // TODO: return exception
    const user = await this.databaseService.user.findUnique({
      where: { id: id },
    });
    // console.log(user.refreshToken);
    if (!user) throw new ForbiddenException();
    for (const hashedToken of user.refreshToken) {
      if (bcrypt.compare(rt, hashedToken)) {
        this.cacheTokenBlacklist(user.id, rt);
        // console.log('blacklist', rt);
        const tokens = await this.createTokens(user.id, user.email, user.role);
        await this.storeRefreshToken(user.id, tokens.refresh_token);
        // console.log(tokens);
        return tokens;
      }
    }
    // TODO: exception
  }

  // func
  async cacheTokenBlacklist(uid: string, rt: string) {
    this.redisService.blacklistToken(uid, rt);
  }

  async validateToken(uid: string, rt: string) {
    return this.redisService.validateSafeToken(uid, rt);
  }

  sendSecurityAlert() {
    // TODO: exception / server sent event
    console.log('xxxxxxx');
  }

  async storeRefreshToken(id: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.databaseService.user.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: {
          push: hash,
        },
      },
    });
  }

  async createTokens(
    id: string,
    email: string,
    role?: string,
  ): Promise<Tokens> {
    if (!role) role = 'user';
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { email, id, role },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'at-secret',
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        },
      ),
      this.jwtService.signAsync(
        { id },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'rt-secret',
          expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
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
