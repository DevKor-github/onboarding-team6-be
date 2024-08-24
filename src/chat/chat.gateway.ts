import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(socket: Socket, roomId: string) {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(socket: Socket, roomId: string) {
    socket.leave(roomId);
    console.log(`Client ${socket.id} left room ${roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, createMessageDto: CreateMessageDto) {
    const message = await this.chatService.createMessage(createMessageDto);
    this.server.to(createMessageDto.roomId).emit('receiveMessage', message);
  }
}
