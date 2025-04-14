import { Injectable, NotFoundException } from '@nestjs/common';
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

  async sendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendRequest> {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });

    if (!sender || !receiver) {
      throw new NotFoundException('User not found');
    }

    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
    });

    if (existingRequest) {
      throw new NotFoundException('Friend request already exists');
    }

    const request = this.friendRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });

    return this.friendRequestRepository.save(request);
  }

  async acceptRequest(requestId: number, userId: number): Promise<void> {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: { id: userId } },
      relations: ['sender', 'receiver'],
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    // Create friendship
    await this.friendService.addFriend(request.sender.id, request.receiver.id);

    // Update request status
    request.status = 'accepted';
    await this.friendRequestRepository.save(request);
  }

  async rejectRequest(requestId: number, userId: number): Promise<void> {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: { id: userId } },
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    request.status = 'rejected';
    await this.friendRequestRepository.save(request);
  }

  async getPendingRequests(userId: number): Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({
      where: { receiver: { id: userId }, status: 'pending' },
      relations: ['sender'],
    });
  }

  async getSentRequests(userId: number): Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({
      where: { sender: { id: userId }, status: 'pending' },
      relations: ['receiver'],
    });
  }

  async getAllRequests(userId: number): Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
