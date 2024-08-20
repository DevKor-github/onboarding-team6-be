import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserDto,
  CreateUserDto,
  ChangePictureDto,
  ChangeOtherDto,
  ChatUserDto,
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

  //유저네임은 수정될 수 있어서
  async findByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  //주로 이렇게 ID로만 검색할듯
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  //1. 내정보 조회
  async getUser(id: string): Promise<UserDto> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.convertToUserDto(user);
  }

  //2. 남의 정보 유저네임으로 조회
  async getUserByUsername(username: string): Promise<UserDto> {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return this.convertToUserDto(user);
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
    return this.convertToCreateUserDto(updatedUser);
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
    return this.convertToCreateUserDto(updatedUser);
  }

  async delete(id: string): Promise<CreateUserDto> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return this.convertToCreateUserDto(deletedUser);
  }

  private convertToUserDto(user: User): UserDto {
    const { username, profilePicture, bio } = user.toObject();
    return { username, profilePicture, bio };
  }

  private convertToCreateUserDto(user: User): CreateUserDto {
    const { username, profilePicture, bio, password } = user.toObject();
    return { username, password, profilePicture, bio };
  }

  async getChatUserDtos(ids: Types.ObjectId[]): Promise<ChatUserDto[]> {
    const users = await this.userModel.find({ _id: { $in: ids } }).exec();
    return users.map((user) => ({
      id: user._id as Types.ObjectId,
      username: user.username,
      profilePicture: user.profilePicture,
    }));
  }
}
