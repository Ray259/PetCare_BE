import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { RedisModule } from './common/redis/redis.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PetsModule } from './pets/pets.module';
import { BaseServiceController } from './service/Base/BaseService.controller';
import { BaseServiceModule } from './service/Base/BaseService.module';
import { MedicineModule } from './medicine/medicine.module';
import { RevenueModule } from './revenue/revenue.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({ global: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'test'),
    }),
    DatabaseModule,
    UsersModule,
    PetsModule,
    ServiceModule,
    AuthModule,
    RedisModule,
    NotificationModule,
    MedicineModule,
    BaseServiceModule,
    RevenueModule,
  ],
  controllers: [AppController, BaseServiceController],
  providers: [AppService, GoogleStrategy, NotificationService],
})
export class AppModule {}
