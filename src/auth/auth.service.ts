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
    return this.generateTokenWithUserInfo(newUser);
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return this.generateTokenWithUserInfo(user);
  }

  // private generateToken(user: any) {
  //   const payload = { username: user.username, sub: user._id };
  //   const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
  //   const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // 리프레시 토큰은 보통 더 긴 유효기간을 가집니다

  //   return {
  //     access_token: accessToken,
  //     refresh_token: refreshToken,
  //   };
  // }

  private generateTokenWithUserInfo(user: any) {
    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user._id,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      console.log('Received refresh token:', refreshToken);
      const decoded = this.jwtService.verify(refreshToken);
      console.log('Decoded refresh token payload:', decoded);

      const user = await this.userService.findById(decoded.sub); // 여기서 sub (user.id)로 사용자 조회
      if (!user) {
        console.error('User not found for ID:', decoded.sub);
        throw new UnauthorizedException('User not found');
      }
      return this.generateTokenWithUserInfo(user);
    } catch (error) {
      console.error('Refresh token validation error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
