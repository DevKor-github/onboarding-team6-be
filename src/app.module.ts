import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { RoomModule } from './room/room.module';
// import { MoneyModule } from './money/money.module';
// import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
<<<<<<< HEAD
import { MoneyModule } from './money/money.module';
=======
>>>>>>> de8a26fa86dca56d45828e0dbbb74c64195beda3

@Module({
  imports: [
    ConfigModule.forRoot(),
<<<<<<< HEAD
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/poor-chat'), // 기본 URI 설정
    AuthModule,
    UserModule,
    MoneyModule,
=======
    MongooseModule.forRoot('mongodb://localhost:27017/poor-chat'), // 기본 URI 설정
    AuthModule,
    UserModule,
>>>>>>> de8a26fa86dca56d45828e0dbbb74c64195beda3
    // RoomModule,
    // MoneyModule,
    // ChatModule,
  ],
})
export class AppModule {}
