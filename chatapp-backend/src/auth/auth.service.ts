import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface Bcrypt {
  hash(password: string, saltRounds: number): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

const bcryptTyped = bcrypt as unknown as Bcrypt;

interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    // In a real application, you would get the user from a database
    // This is a mock user for demonstration
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      password: await bcryptTyped.hash('testpass', 10), // Hashed password
    };

    const isPasswordValid = await bcryptTyped.compare(
      password,
      mockUser.password,
    );

    if (username === mockUser.username && isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = mockUser;
      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id };
    return {
      userInfo: user,
      token: this.jwtService.sign(payload),
    };
  }
}
