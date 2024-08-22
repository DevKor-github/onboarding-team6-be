import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.dto';

@ApiTags('auth') // Swagger 태그로 이 컨트롤러를 그룹화
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @ApiResponse({
    status: 200,
    description: 'refresh token을 사용해 만료된 access token을 재발급합니다.',
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return this.authService.refreshToken(body.refreshToken);
  }
}
