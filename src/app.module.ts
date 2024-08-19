import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
// import { MoneyModule } from './money/money.module';
// import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/poor-chat'), // 기본 URI 설정
    AuthModule,
    UserModule,
    RoomModule,
    // MoneyModule,
    // ChatModule,
  ],
})
export class AppModule {}
