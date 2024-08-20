import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly roomId: string;

  @IsString()
  @IsNotEmpty()
  readonly senderId: string;

  @IsString()
  @IsNotEmpty()
  readonly senderUsername: string;

  @IsEnum(['user', 'owner'])
  @IsNotEmpty()
  readonly senderType: 'user' | 'owner';

  @IsString()
  @IsNotEmpty()
  readonly message: string;
}

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly roomId: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
