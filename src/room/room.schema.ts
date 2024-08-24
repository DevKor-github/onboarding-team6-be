import { Schema, Document, Types } from 'mongoose';

export interface Room extends Document {
  roomName: string;
  ownerId: Types.ObjectId;
  createdAt: Date;
  memberCount: number;
  members: Types.ObjectId[];
}

export const RoomSchema = new Schema({
  roomName: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  memberCount: { type: Number, default: 0 },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
