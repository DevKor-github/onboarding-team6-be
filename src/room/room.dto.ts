import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
