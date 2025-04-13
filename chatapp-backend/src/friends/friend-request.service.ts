import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './friend-request.entity';
import { User } from '../users/user.entity';
import { FriendService } from './friend.service';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private friendService: FriendService,
  ) {}

  async sendRequest(senderId: number, receiverId: number) {
    const [sender, receiver] = await Promise.all([
      this.userRepository.findOneBy({ id: senderId }),
      this.userRepository.findOneBy({ id: receiverId }),
    ]);

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    return this.friendRequestRepository.save({
      sender,
      receiver,
      status: 'pending',
    });
  }

  async acceptRequest(requestId: number, receiverId: number) {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: { id: receiverId } },
      relations: ['sender', 'receiver'],
    });

    if (!request) {
      throw new Error('Request not found');
    }

    // Create friendship
    await this.friendService.addFriend(request.sender.id, request.receiver.id);

    // Update request status
    request.status = 'accepted';
    return this.friendRequestRepository.save(request);
  }

  async rejectRequest(requestId: number, receiverId: number) {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: { id: receiverId } },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    request.status = 'rejected';
    return this.friendRequestRepository.save(request);
  }

  async getPendingRequests(userId: number) {
    return this.friendRequestRepository.find({
      where: { receiver: { id: userId }, status: 'pending' },
      relations: ['sender'],
    });
  }

  async getSentRequests(userId: number) {
    return this.friendRequestRepository.find({
      where: { sender: { id: userId }, status: 'pending' },
      relations: ['receiver'],
    });
  }
}
