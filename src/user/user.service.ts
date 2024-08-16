import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserDto,
  CreateUserDto,
  ChangePictureDto,
  ChangeOtherDto,
} from './user.dto';
import { User } from './user.schema'; // User 타입 가져오기
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

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  async getUser(id: string): Promise<UserDto> {
    let userId: Types.ObjectId;

    try {
      userId = new Types.ObjectId(id);
    } catch (error) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { username, profilePicture, bio } = user.toObject();
    return { username, profilePicture, bio } as UserDto;
  }

  async updatePicture(
    id: string,
    changePictureDto: ChangePictureDto,
  ): Promise<CreateUserDto> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { profilePicture: changePictureDto.profilePicture },
        { new: true },
      )
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser.toObject() as CreateUserDto;
  }

  async update(
    id: string,
    changeOtherDto: ChangeOtherDto,
  ): Promise<CreateUserDto> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { ...changeOtherDto }, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser.toObject() as CreateUserDto;
  }

  async delete(id: string): Promise<CreateUserDto> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser.toObject() as CreateUserDto;
  }
}
