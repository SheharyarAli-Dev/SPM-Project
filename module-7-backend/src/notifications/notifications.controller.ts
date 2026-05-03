import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  findAll(@Query('recipient_id') recipient_id: string) {
    return this.notificationsService.findAll(+recipient_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(+id);
  }
}
