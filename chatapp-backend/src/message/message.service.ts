import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Friend } from '../friends/friend.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) {}

  async sendMessage(senderId: number, receiverId: number, content: string) {
    const [sender, receiver] = await Promise.all([
      this.userRepository.findOneBy({ id: senderId }),
      this.userRepository.findOneBy({ id: receiverId }),
    ]);

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    // Check if users are friends
    const friendship = await this.friendRepository.findOne({
      where: [
        { user1: { id: senderId }, user2: { id: receiverId } },
        { user1: { id: receiverId }, user2: { id: senderId } },
      ],
    });

    if (!friendship) {
      throw new Error('Users must be friends to send messages');
    }

    return this.messageRepository.save({
      sender,
      receiver,
      content,
      isRead: false,
    });
  }

  async getMessages(userId: number, otherUserId: number) {
    return this.messageRepository.find({
      where: [
        { sender: { id: userId }, receiver: { id: otherUserId } },
        { sender: { id: otherUserId }, receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }

  async markAsRead(messageIds: number[], userId: number) {
    return this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('id IN (:...ids)', { ids: messageIds })
      .andWhere('receiverId = :userId', { userId })
      .execute();
  }

  async getUnreadMessages(userId: number) {
    return this.messageRepository.find({
      where: { receiver: { id: userId }, isRead: false },
      relations: ['sender'],
    });
  }
}
