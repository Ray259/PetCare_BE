import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }
  async onModuleInit() {
    await this.$connect();
    this.$on('error' as never, ({ message }: { message: string }) => {
      this.logger.error(message);
    });
    this.$on('warn' as never, ({ message }: { message: string }) => {
      this.logger.warn(message);
    });
    this.$on('info' as never, ({ message }: { message: string }) => {
      this.logger.debug(message);
    });
    this.$on(
      'query' as never,
      ({ query, params }: { query: string; params: any }) => {
        this.logger.log(`${query}; ${params}`);
      },
    );
  }
}
