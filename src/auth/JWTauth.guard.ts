import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('canActivate 함수 호출됨');
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
      console.log('Authorization header missing');
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log('Token missing');
      throw new UnauthorizedException('Token missing');
    }

    try {
      console.log('Token:', token);
      const decoded = this.jwtService.verify(token);
      console.log('Decoded JWT-디버깅용:', decoded);
      request.user = decoded;
      return true;
    } catch (error) {
      console.error('JWT verification error-디버깅용:', error);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
