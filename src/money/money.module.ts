import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { Money, MoneySchema } from './money.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Money.name, schema: MoneySchema }])],
  controllers: [MoneyController],
  providers: [MoneyService],
})
export class MoneyModule {}
