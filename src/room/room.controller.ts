import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto, JoinRoomDto } from './room.dto';
import { Types } from 'mongoose';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Room } from './room.schema';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: '채팅방 생성' })
  @ApiResponse({ status: 201, description: '채팅방 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Req() request,
  ): Promise<Room> {
    const ownerId = request.user.userId;
    return await this.roomService.create({ ...createRoomDto, ownerId });
  }

  @ApiOperation({
    summary: '채팅방 수정(방이름 변경시) - owner만 가능',
  })
  @ApiResponse({ status: 200, description: '채팅방 수정 성공' })
  @ApiResponse({ status: 404, description: '채팅방을 찾을 수 없음' })
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return await this.roomService.update(new Types.ObjectId(id), updateRoomDto);
  }

  @ApiOperation({ summary: '채팅방 삭제 - owner만 가능' })
  @ApiResponse({ status: 200, description: '채팅방 삭제 성공' })
  @ApiResponse({ status: 404, description: '채팅방을 찾을 수 없음' })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async deleteRoom(@Param('id') id: string) {
    return await this.roomService.delete(new Types.ObjectId(id));
  }

  @ApiOperation({ summary: '채팅방 참가' })
  @ApiResponse({ status: 200, description: '채팅방 참가 성공' })
  @ApiResponse({ status: 404, description: '채팅방을 찾을 수 없음' })
  @Put(':id/join')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async joinRoom(@Param('id') id: string, @Body() joinRoomDto: JoinRoomDto) {
    return await this.roomService.joinRoom(new Types.ObjectId(id), joinRoomDto);
  }
  @ApiOperation({ summary: '채팅방 탈퇴' })
  @ApiResponse({ status: 200, description: '채팅방 탈퇴 성공' })
  @ApiResponse({ status: 404, description: '채팅방을 찾을 수 없음' })
  @Put(':id/leave')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async leaveRoom(@Param('id') id: string, @Body('userId') userId: string) {
    return await this.roomService.leaveRoom(
      new Types.ObjectId(id),
      new Types.ObjectId(userId),
    );
  }
}
