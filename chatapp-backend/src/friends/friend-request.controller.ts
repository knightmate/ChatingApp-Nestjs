import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

interface SendRequestDto {
  receiverId: number;
}

@Controller('friend-requests')
@UseGuards(JwtAuthGuard)
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post('send')
  sendRequest(
    @Req() req: CustomRequest,
    @Body() sendRequestDto: SendRequestDto,
  ) {
    const userId = req.user.userId;
    return this.friendRequestService.sendRequest(userId, sendRequestDto.receiverId);
  }

  @Post('accept/:requestId')
  acceptRequest(
    @Req() req: CustomRequest,
    @Param('requestId') requestId: string,
  ) {
    const userId = req.user.userId;
    return this.friendRequestService.acceptRequest(+requestId, userId);
  }

  @Post('reject/:requestId')
  rejectRequest(
    @Req() req: CustomRequest,
    @Param('requestId') requestId: string,
  ) {
    const userId = req.user.userId;
    return this.friendRequestService.rejectRequest(+requestId, userId);
  }

  @Get('pending')
  getPendingRequests(@Req() req: CustomRequest) {
    const userId = req.user.userId;
    return this.friendRequestService.getPendingRequests(userId);
  }

  @Get('sent')
  getSentRequests(@Req() req: CustomRequest) {
    const userId = req.user.userId;
    return this.friendRequestService.getSentRequests(userId);
  }
} 