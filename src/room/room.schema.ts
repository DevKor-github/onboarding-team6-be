import { Schema } from 'mongoose';

export const RoomSchema = new Schema({
  roomName: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  memberCount: { type: Number, default: 0 },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
