import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMoneyDto, AddHistoryDto, UpdateHistoryDto } from './money.dto';
import { Money, MoneyDocument } from './money.schema';

@Injectable()
export class MoneyService {s
  constructor(@InjectModel(Money.name) private moneyModel: Model<MoneyDocument>) {}

  async create(createMoneyDto: CreateMoneyDto): Promise<Money> {
    const { userId } = createMoneyDto;
  
    const createdMoney = new this.moneyModel({
      userId: new Types.ObjectId(userId),
      total: 0, // 잔고 초기값 설정, 필요시 변경 가능
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

  async addHistory(userId: Types.ObjectId, addHistoryDto: AddHistoryDto): Promise<Money> {
    const money: MoneyDocument = await this.findByUserId(userId);
    money.history.push({
      _id: new Types.ObjectId(),
      ...addHistoryDto,
      timestamp: new Date(),
    });
    if (addHistoryDto.type === 'earn') {
      money.total += addHistoryDto.amount;
    } else if (addHistoryDto.type === 'spend') {
      money.total -= addHistoryDto.amount;
    }
    return money.save();
  }

  async updateHistory(userId: Types.ObjectId, historyId: Types.ObjectId, updateHistoryDto: UpdateHistoryDto): Promise<Money> {
    const money: MoneyDocument = await this.findByUserId(userId);
    const historyItem = money.history.id(historyId);
    if (!historyItem) {
      throw new NotFoundException('History record not found');
    }

    historyItem.memo = updateHistoryDto.memo || historyItem.memo;
    money.total -= historyItem.amount; // 기존 금액 제거
    historyItem.amount = updateHistoryDto.amount;
    money.total += historyItem.amount; // 수정된 금액 반영

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
