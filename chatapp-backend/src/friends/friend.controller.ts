import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

interface AddFriendDto {
  friendId: number;
}

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('add')
  addFriend(@Req() req: CustomRequest, @Body() addFriendDto: AddFriendDto) {
    const userId = req.user.userId;
    return this.friendService.addFriend(userId, addFriendDto.friendId);
  }

  @Post('remove/:friendId')
  removeFriend(@Req() req: CustomRequest, @Param('friendId') friendId: string) {
    const userId = req.user.userId;
    return this.friendService.removeFriend(userId, +friendId);
  }

  @Get('list')
  getFriendsList(@Req() req: CustomRequest) {
    const userId = req.user.userId;
    return this.friendService.getFriends(userId);
  }
}
