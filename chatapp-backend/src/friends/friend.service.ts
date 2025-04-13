import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addFriend(userId: number, friendId: number) {
    const [user1, user2] = await Promise.all([
      this.userRepository.findOneBy({ id: userId }),
      this.userRepository.findOneBy({ id: friendId }),
    ]);

    if (!user1 || !user2) {
      throw new Error('User not found');
    }

    return this.friendRepository.save({
      user1,
      user2,
    });
  }

  async removeFriend(userId: number, friendId: number) {
    const friend = await this.friendRepository.findOne({
      where: [
        { user1: { id: userId }, user2: { id: friendId } },
        { user1: { id: friendId }, user2: { id: userId } },
      ],
    });

    if (friend) {
      return this.friendRepository.remove(friend);
    }
  }

  async getFriends(userId: number) {
    const friends = await this.friendRepository.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2'],
    });

    return friends.map((friend) => {
      const friendUser = friend.user1.id === userId ? friend.user2 : friend.user1;
      const { password, ...friendWithoutPassword } = friendUser;
      return friendWithoutPassword;
    });
  }
}
