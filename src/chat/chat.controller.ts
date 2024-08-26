import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateMessageDto } from './chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Get all messages in a chat room - 에러있음' })
  @ApiParam({
    name: 'roomId',
    type: 'string',
    description: 'The ID of the chat room',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all messages in the specified chat room',
    type: [CreateMessageDto], // 기대되는 반환 타입을 ChatMessageDto로 지정
  })
  @ApiResponse({
    status: 404,
    description: 'Chat room not found',
  })
  @Get('room/:roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }
}
