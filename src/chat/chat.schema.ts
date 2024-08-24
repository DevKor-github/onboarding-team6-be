import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({
    type: [
      {
        _id: Types.ObjectId,
        senderId: { type: Types.ObjectId, ref: 'User', required: true },
        senderUsername: { type: String, required: true },
        senderType: { type: String, enum: ['user', 'owner'], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        readBy: [{ type: Types.ObjectId, ref: 'User' }],
      },
    ],
    required: true,
  })
  messages: Record<string, any>[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
