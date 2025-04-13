// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ✅ This registers Repository<User>
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule], // ✅ Export the TypeOrmModule to share UserRepository
})
export class UsersModule {}
