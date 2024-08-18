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

  //유저네임은 수정될 수 있어서 이름으로 검색 안하고
  async findByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  //주로 이렇게 ID로만 검색할듯
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async getUser(id: string): Promise<UserDto> {
    console.log('Looking for user with ID:', id);

    // 이 시점에서 id는 MongoDB의 _id와 동일한 문자열이어야 합니다.
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      console.log('User not found for ID:', id);
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
