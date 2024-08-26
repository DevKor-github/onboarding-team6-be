import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from './room.schema';
import { CreateRoomDto, UpdateRoomDto, JoinRoomDto } from './room.dto';
import { User } from '../user/user.schema';
import { ChatUserDto } from '../user/user.dto';
import { RoomDto } from './room.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    private readonly userService: UserService,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new this.roomModel({
      ...createRoomDto,
      members: [createRoomDto.ownerId], // 방장을 멤버로 추가
      memberCount: 1, // 멤버 수 초기화
    });
    return await newRoom.save();
  }

  async update(
    id: Types.ObjectId,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
    if (!updatedRoom) {
      throw new NotFoundException('Room not found');
    }
    return updatedRoom;
  }

  async delete(id: Types.ObjectId): Promise<Room> {
    const deletedRoom = await this.roomModel.findByIdAndDelete(id).exec();
    if (!deletedRoom) {
      throw new NotFoundException('Room not found');
    }
    return deletedRoom;
  }

  async joinRoom(id: Types.ObjectId, joinRoomDto: JoinRoomDto): Promise<Room> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    room.members.push(joinRoomDto.userId);
    room.memberCount = room.members.length;
    return await room.save();
  }

  async leaveRoom(id: Types.ObjectId, userId: Types.ObjectId): Promise<Room> {
    const room = await this.roomModel.findById(id).exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }
    console.log('Room ID:', id);
    console.log('must delete User ID:', userId);
    console.log('Room Members:', room.members);

    // 사용자가 방에 존재하는지 확인
    const memberIndex = room.members.findIndex((member) =>
      member.equals(userId),
    );
    if (memberIndex === -1) {
      throw new NotFoundException('User not found in room');
    }

    // 방에서 사용자 제거
    room.members.splice(memberIndex, 1);
    room.memberCount = room.members.length;
    return await room.save();
  }

  async getAllRooms(): Promise<RoomDto[]> {
    const rooms = await this.roomModel.find().exec();
    return Promise.all(rooms.map((room) => this.mapToDto(room)));
  }

  async getRoomByName(roomName: string): Promise<RoomDto> {
    const room = await this.roomModel.findOne({ roomName }).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return this.mapToDto(room);
  }

  async getRoomById(id: string): Promise<RoomDto> {
    if (!Types.ObjectId.isValid(id)) {
      console.log(`Invalid ID format: ${id}`);
      throw new NotFoundException('Room not found');
    }

    console.log(`Fetching room with ID: ${id}`);

    const room = await this.roomModel.findOne({ _id: id }).exec();
    if (!room) {
      console.log(`Room with ID: ${id} not found`);
      throw new NotFoundException('Room not found');
    }
    console.log(`Room with ID: ${id} found`);
    return this.mapToDto(room);
  }

  async getRoomsByUser(userId: Types.ObjectId): Promise<RoomDto[]> {
    const rooms = await this.roomModel.find({ members: userId }).exec();
    return Promise.all(rooms.map((room) => this.mapToDto(room)));
  }

  private async mapToDto(room: Room): Promise<RoomDto> {
    const memberDtos = await this.userService.getChatUserDtos(room.members);
    return {
      id: room.id,
      roomName: room.roomName,
      ownerId: room.ownerId,
      createdAt: room.createdAt,
      memberCount: room.memberCount,
      members: memberDtos,
    };
  }
}
