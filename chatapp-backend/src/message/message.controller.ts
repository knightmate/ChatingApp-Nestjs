import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

interface SendMessageDto {
  receiverId: number;
  content: string;
}

interface MarkAsReadDto {
  messageIds: number[];
}

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  sendMessage(
    @Req() req: CustomRequest,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const userId = req.user.userId;
    return this.messageService.sendMessage(
      userId,
      sendMessageDto.receiverId,
      sendMessageDto.content,
    );
  }

  @Get('chat/:otherUserId')
  getMessages(
    @Req() req: CustomRequest,
    @Param('otherUserId') otherUserId: string,
  ) {
    const userId = req.user.userId;
    return this.messageService.getMessages(userId, +otherUserId);
  }

  @Post('read')
  markAsRead(@Req() req: CustomRequest, @Body() markAsReadDto: MarkAsReadDto) {
    const userId = req.user.userId;
    return this.messageService.markAsRead(markAsReadDto.messageIds, userId);
  }

  @Get('unread')
  getUnreadMessages(@Req() req: CustomRequest) {
    const userId = req.user.userId;
    return this.messageService.getUnreadMessages(userId);
  }
}
