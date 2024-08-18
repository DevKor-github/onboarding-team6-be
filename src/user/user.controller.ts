import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  UserDto,
  CreateUserDto,
  ChangePictureDto,
  ChangeOtherDto,
} from './user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '내정보 요청 - 이름, 프로필사진, 한줄소개' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: UserDto })
  async getUser(@Req() request): Promise<UserDto> {
    // userId를 sub에서 가져옵니다.
    const userId = request.user.userId;
    console.log('Decoded user info:', request.user); // 디버깅용 로그
    return this.userService.getUser(userId);
  }

  @ApiOperation({ summary: '내정보 수정 - 프로필사진만 수정' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Put('me/picture')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: ChangePictureDto })
  async updatePicture(
    @Body() changePictureDto: ChangePictureDto,
    @Req() request,
  ): Promise<ChangePictureDto> {
    const userId = request.user.userId;
    console.log('Updating picture for user with ID:', userId);
    return this.userService.updatePicture(userId, changePictureDto);
  }

  @ApiOperation({ summary: '내정보 수정 - 이름, 비번, 한줄소개 수정' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Put('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: ChangeOtherDto })
  async update(
    @Body() changeOtherDto: ChangeOtherDto,
    @Req() request,
  ): Promise<ChangeOtherDto> {
    const userId = request.user.userId;
    console.log('Updating user with ID:', userId);
    return this.userService.update(userId, changeOtherDto);
  }

  @ApiOperation({ summary: '탈퇴시 유저 삭제' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Delete('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: CreateUserDto })
  async delete(@Req() request): Promise<CreateUserDto> {
    const userId = request.user.userId;
    console.log('Deleting user with ID:', userId);
    return this.userService.delete(userId);
  }
}
