import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: Prisma.UserCreateInput) {
    const hash = await bcrypt.hash(dto.password, 10);
    dto.password = hash;
    return this.databaseService.user.create({ data: dto });
  }

  findAll() {
    return this.databaseService.user.findMany({});
  }

  findOne(id: string) {
    return this.databaseService.user.findUnique({ where: { id } });
  }

  update(id: string, dto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: string) {
    return this.databaseService.user.delete({ where: { id } });
  }
}
