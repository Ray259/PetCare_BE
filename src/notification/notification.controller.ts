import { Controller, Sse, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';
import { ServerMessage } from './type/message.type';
import { NotificationDto } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse()
  events(): Observable<any> {
    return this.notificationService.subscribe();
  }

  // Triggering notification to test
  @Post('emit')
  async emit(@Body() dto: NotificationDto): Promise<ServerMessage> {
    return this.notificationService.emit(dto);
  }
}
