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
import { HealthcareServiceModule } from './service/healthcare/healthcare.module';
import { GroomingServiceModule } from './service/grooming/grooming.module';
import { AppointmentServiceModule } from './service/appointment/appointment.module';
import { BoardingServiceModule } from './service/boarding/boarding.module';
import { ServiceManagerModule } from './service/ServiceManager.module';

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
    HealthcareServiceModule,
    GroomingServiceModule,
    AppointmentServiceModule,
    BoardingServiceModule,
    ServiceManagerModule,
    AuthModule,
    RedisModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, NotificationService],
})
export class AppModule {}
