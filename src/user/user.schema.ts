import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: String,
  bio: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TypeScript 타입 정의
export interface User extends Document {
  username: string;
  password: string;
  profilePicture?: string;
  bio?: string;
}
