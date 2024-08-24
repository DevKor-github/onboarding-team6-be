import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema()
class History {
  @Prop({ type: String, enum: ['spend', 'earn'], required: true })
  type: string;

  @Prop()
  memo: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: Number, required: true })
  amount: number;
}


export const HistorySchema = SchemaFactory.createForClass(History);

@Schema()
export class Money {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  total: number;

  @Prop({ type: [HistorySchema], default: [] })
  history: Types.DocumentArray<History>;
}


export type MoneyDocument = Money & Document;
export const MoneySchema = SchemaFactory.createForClass(Money);
