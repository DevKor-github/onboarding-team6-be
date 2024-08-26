import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from './chat.schema';
import { CreateMessageDto } from './chat.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Chat') private readonly chatModel: Model<Chat>) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<any> {
    const { roomId, senderId, senderUsername, senderType, message } =
      createMessageDto;

    const chat = await this.chatModel.findOne({
      roomId: new Types.ObjectId(roomId),
    });

    if (!chat) {
      throw new NotFoundException('Room not found');
    }

    const newMessage = {
      _id: new Types.ObjectId(),
      senderId: new Types.ObjectId(senderId),
      senderUsername,
      senderType,
      message,
      timestamp: new Date(),
      readBy: [],
    };

    chat.messages.push(newMessage);
    await chat.save();

    return newMessage;
  }

  async getMessages(roomId: string): Promise<any[]> {
    const objectId = new Types.ObjectId(roomId);

    // 변환된 ObjectId를 콘솔에 출력
    console.log(`Converted ObjectId: ${objectId}`);

    // 변환된 ObjectId로 검색
    const chat = await this.chatModel.findOne({ roomId: objectId }).exec();

    if (!chat) {
      throw new NotFoundException('Room not found');
    }

    return chat.messages;
  }
}
