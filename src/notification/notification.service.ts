import { Injectable } from '@nestjs/common';
import { fromEvent } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from 'src/database/database.service';
import { ServerMessage } from './type/message.type';
import { NotificationDto } from './dto/notification.dto';
@Injectable()
export class NotificationService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private databaseService: DatabaseService,
  ) {}

  subscribe() {
    return fromEvent(this.eventEmitter, 'event');
  }

  async emit(dto: NotificationDto): Promise<ServerMessage> {
    const message: ServerMessage = {
      type: dto.type,
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      date: new Date(),
    };
    // await this.saveMessageToDB(message);
    this.eventEmitter.emit('event', { data: message });
    return message;
  }

  async saveMessageToDB(message: ServerMessage) {
    return await this.databaseService.notification.create({ data: message });
  }
}
