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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: UserDto })
  // async getUser(@Req() request): Promise<UserDto> {
  //   console.log('Decoded user info:', request.user);
  //   return this.userService.getUser(request.user.id);
  // }
  // async getUser(@Req() request): Promise<UserDto> {
  //   const { id, sub } = request.user;
  //   console.log('Decoded user info:', request.user); // 디버깅용
  //   return this.userService.getUser(id, sub);
  // }
  // async getUser(@Req() request): Promise<UserDto> {
  //   // request.user.userId에서 id를 가져옵니다.
  //   const userId = request.user.userId || request.user.sub;
  //   console.log('Decoded user info:', request.user); // 디버깅용
  //   return this.userService.getUser(userId, userId);
  // }
  async getUser(@Req() request): Promise<UserDto> {
    // userId를 sub에서 가져옵니다.
    const userId = request.user.userId;
    console.log('Decoded user info:', request.user); // 디버깅용 로그
    return this.userService.getUser(userId);
  }

  @Put('me/picture')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: ChangePictureDto })
  async updatePicture(
    @Body() changePictureDto: ChangePictureDto,
    @Req() request,
  ): Promise<ChangePictureDto> {
    return this.userService.updatePicture(request.user.id, changePictureDto);
  }

  @Put('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: ChangeOtherDto })
  async update(
    @Body() changeOtherDto: ChangeOtherDto,
    @Req() request,
  ): Promise<ChangeOtherDto> {
    return this.userService.update(request.user.id, changeOtherDto);
  }

  @Delete('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: CreateUserDto })
  async delete(@Req() request): Promise<CreateUserDto> {
    return this.userService.delete(request.user.id);
  }
}
