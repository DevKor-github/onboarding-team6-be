import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ChatUserDto } from '../user/user.dto';

export class CreateRoomDto {
  @ApiProperty({
    description: '방이름',
    example: '품격있는 거지방 (반모)',
  })
  @IsString()
  @IsNotEmpty()
  roomName: string;

  @ApiProperty({
    description: '만든 사람의 _ID',
    example: '123456789(유저_id)',
  })
  @IsNotEmpty()
  ownerId: Types.ObjectId;
}

export class UpdateRoomDto {
  @ApiProperty({
    description: '방이름',
    example: '품격있는 거지방 (반모)',
  })
  @IsString()
  roomName?: string;
}

export class JoinRoomDto {
  @ApiProperty({
    description: 'join 하려는 사람의 _ID',
    example: '123456789(유저_id)',
  })
  @IsNotEmpty()
  userId: Types.ObjectId;
}
export class RoomDto {
  @ApiProperty({
    description: '채팅방 이름',
    example: '품격있는 거지방 (반모)',
  })
  roomName: string;

  @ApiProperty({
    description: '방장 ID',
    example: '123456789(유저_id)',
  })
  ownerId: Types.ObjectId;

  @ApiProperty({
    description: '채팅방 생성 날짜',
    example: '2024-08-20T14:48:20.624Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '현재 멤버 수',
    example: 10,
  })
  memberCount: number;

  @ApiProperty({
    description: '채팅방 멤버 정보 리스트',
    type: [ChatUserDto],
    example: ['123456789+유저네임', '987654321+유저네임'],
  })
  members: ChatUserDto[];
}
