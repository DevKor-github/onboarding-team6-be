import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The ID of the chat room',
    example: '66c4adb60a69a44b4a878989',
  })
  @IsString()
  @IsNotEmpty()
  readonly roomId: string;

  @ApiProperty({
    description: 'The ID of the message sender',
    example: '66c17f79e63d5bd73337f1af',
  })
  @IsString()
  @IsNotEmpty()
  readonly senderId: string;

  @ApiProperty({
    description: 'The username of the message sender',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  readonly senderUsername: string;

  @ApiProperty({
    description: 'The type of the message sender (user or owner)',
    enum: ['user', 'owner'],
    example: 'user',
  })
  @IsEnum(['user', 'owner'])
  @IsNotEmpty()
  readonly senderType: 'user' | 'owner';

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello everyone!',
  })
  @IsString()
  @IsNotEmpty()
  readonly message: string;
}

export class JoinRoomDto {
  @ApiProperty({
    description: 'The ID of the chat room to join',
    example: '66c4adb60a69a44b4a878989',
  })
  @IsString()
  @IsNotEmpty()
  readonly roomId: string;

  @ApiProperty({
    description: 'The ID of the user joining the room',
    example: '66c17f79e63d5bd73337f1af',
  })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
