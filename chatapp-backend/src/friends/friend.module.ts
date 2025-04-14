import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { FriendRequest } from './friend-request.entity';
import { FriendService } from './friend.service';
import { FriendRequestService } from './friend-request.service';
import { FriendController } from './friend.controller';
import { FriendRequestController } from './friend-request.controller';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, FriendRequest]), UsersModule],
  controllers: [FriendController, FriendRequestController],
  providers: [FriendService, FriendRequestService],
  exports: [FriendService, FriendRequestService],
})
export class FriendModule {}
