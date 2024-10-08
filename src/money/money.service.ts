import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMoneyDto, AddHistoryDto, UpdateHistoryDto } from './money.dto';
import { Money, MoneyDocument } from './money.schema';

@Injectable()
export class MoneyService {s
  constructor(@InjectModel(Money.name) private moneyModel: Model<MoneyDocument>) {}

  async create(createMoneyDto: CreateMoneyDto): Promise<Money> {
    const { userId, total } = createMoneyDto;
  
    const createdMoney = new this.moneyModel({
      userId: new Types.ObjectId(userId),
      total: parseFloat(total), // 잔고 초기값 설정, 필요시 변경 가능
      history: [],
    });
  
    return createdMoney.save();
  }

  async findByUserId(userId: Types.ObjectId): Promise<MoneyDocument> {
    const money = await this.moneyModel.findOne({ userId }).exec();
    if (!money) {
      throw new NotFoundException('Money record not found');
    }
    return money;
  }

  async getHistory(userId: Types.ObjectId): Promise<Money> {
    const money: MoneyDocument = await this.findByUserId(userId);
    return money;
  }

  async addHistory(userId: Types.ObjectId, addHistoryDto: AddHistoryDto): Promise<Money> {
    const money: MoneyDocument = await this.findByUserId(userId);
    const amount = parseFloat(addHistoryDto.amount);
    money.history.push({
      _id: new Types.ObjectId(),
      ...addHistoryDto,
      amount,
      timestamp: new Date(addHistoryDto.date), 
    });

    if (addHistoryDto.type === 'earn') {
      money.total += amount;
    } else if (addHistoryDto.type === 'spend') {
      money.total -= amount;
    }

    return money.save();
  }

  async updateHistory(userId: Types.ObjectId, historyId: Types.ObjectId, updateHistoryDto: UpdateHistoryDto): Promise<Money> {
    const money: MoneyDocument = await this.findByUserId(userId);
    const historyItem = money.history.id(historyId);
    if (!historyItem) {
      throw new NotFoundException('History record not found');
    }

    const amount = parseFloat(updateHistoryDto.amount);

    // 기존 금액과 타입에 따른 잔고 원상복구
  if (historyItem.type === 'earn') {
    money.total -= historyItem.amount;
  } else if (historyItem.type === 'spend') {
    money.total += historyItem.amount;
  }

  // 새로운 타입과 금액에 따른 잔고 조정
  if (updateHistoryDto.type === 'earn') {
    money.total += parseFloat(updateHistoryDto.amount);
  } else if (updateHistoryDto.type === 'spend') {
    money.total -= parseFloat(updateHistoryDto.amount);
  }

  // 새로운 값을 적용
  historyItem.memo = updateHistoryDto.memo || historyItem.memo;
  historyItem.amount = parseFloat(updateHistoryDto.amount);
  historyItem.type = updateHistoryDto.type || historyItem.type;
  historyItem.timestamp = new Date(updateHistoryDto.date || historyItem.timestamp);

  return money.save();
  }

  async deleteHistory(userId: Types.ObjectId, historyId: Types.ObjectId): Promise<Money> {
    const money: MoneyDocument = await this.findByUserId(userId);
    const historyItem = money.history.id(historyId);
    if (!historyItem) {
      throw new NotFoundException('History record not found');
    }

    money.total -= historyItem.amount; // 금액을 잔고에서 제거
    money.history.pull(historyItem._id);

    return money.save();
  }
}

