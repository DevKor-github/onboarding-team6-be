import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.generateToken(newUser);
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // 리프레시 토큰은 보통 더 긴 유효기간을 가집니다

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userService.findByUsername(decoded.username);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
