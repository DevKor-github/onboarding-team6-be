import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { Money, MoneySchema } from './money.schema';
import { UserModule } from '../user/user.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Money', schema: MoneySchema }]),
    UserModule,
  ],
  controllers: [MoneyController],
  providers: [MoneyService],
})
export class MoneyModule {}
