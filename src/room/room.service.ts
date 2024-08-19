import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from './room.schema';
import { CreateRoomDto, UpdateRoomDto, JoinRoomDto } from './room.dto';

@Injectable()
export class RoomService {
  constructor(@InjectModel('Room') private readonly roomModel: Model<Room>) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new this.roomModel(createRoomDto);
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
}
