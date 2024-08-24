import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { MoneyService } from './money.service';
import { CreateMoneyDto, AddHistoryDto, UpdateHistoryDto } from './money.dto';
import { Types } from 'mongoose';
import { ApiBody, ApiOkResponse, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Money } from './money.schema';
import { UserService } from '../user/user.service';

@ApiTags('money')
@Controller('money')
export class MoneyController {
  constructor(
    private readonly moneyService: MoneyService,
    private readonly userService: UserService,
  ) {}

  private async getUserIdByUsername(username: string): Promise<Types.ObjectId> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user._id;
  }

  @ApiOperation({ summary: '내 잔고 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiOkResponse({ type: Money })
  @ApiBody({
    schema: {
      properties: {
        total: { type: 'string', description: '초기 잔고' },
      },
      required: ['total'],
    },
  })
  @Post(':username')
  async create(@Param('username') username: string, @Body() createMoneyDto: CreateMoneyDto): Promise<Money> { 
    const userId = await this.getUserIdByUsername(username);
    createMoneyDto.userId = userId;
    return this.moneyService.create(createMoneyDto);
  }

///userId는 _id를 의미함
  @ApiOperation({ summary: '내 잔고 조회' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Get(':username')
  async getMoney(@Param('username') username: string) {
    const userId = await this.getUserIdByUsername(username);
    return this.moneyService.findByUserId(userId);
  }

  @ApiOperation({ summary: '지출/수입 내역 조회' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Get(':username/history')
  async getHistory(@Param('username') username: string) {
    const userId = await this.getUserIdByUsername(username);
    return this.moneyService.getHistory(userId);
  }

  @ApiOperation({ summary: '지출/수입 내역 등록' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiOkResponse({ type: AddHistoryDto })
  @ApiBody({
    schema: {
      properties: {
        amount: { type: 'string', description: '금액' },
        memo: { type: 'string', description: '내용' },
        type: { type: 'string', enum: ['spend', 'earn'], description: '지출 또는 수입' },
        date: { type: 'string', description: '날짜 (YYYY-MM-DD)' },
    },
    required: ['amount', 'memo', 'type', 'date'],
    },
  })
  @Post(':username/history')
  async addHistory(@Param('username') username: string, @Body() addHistoryDto: AddHistoryDto) {
    const userId = await this.getUserIdByUsername(username);
    return this.moneyService.addHistory(userId, addHistoryDto);
  }

  ///historyId는 사용자의 지출/수입 내역 중 특정 내역을 의미함
  @ApiOperation({ summary: '지출/수입 내역 수정 - 특정 내역 수정' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiOkResponse({ type: UpdateHistoryDto })
  @ApiBody({
    schema: {
      properties: {
        amount: { type: 'string', description: '금액' },
        memo: { type: 'string', description: '내용' },
        date: { type: 'string', description: '날짜 (YYYY-MM-DD)' },
    },
    required: ['amount', 'memo', 'date'],
    },
  })
  @Put(':username/history/:historyId')
  async updateHistory(@Param('username') username: string, @Param('historyId') historyId: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    const userId = await this.getUserIdByUsername(username);
    return this.moneyService.updateHistory(userId, new Types.ObjectId(historyId), updateHistoryDto);
  }

  @ApiOperation({ summary: '지출/수입 내역 삭제 - 특정 내역 삭제' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Delete(':username/history/:historyId')
  async deleteHistory(@Param('username') username: string, @Param('historyId') historyId: string) {
    const userId = await this.getUserIdByUsername(username);
    return this.moneyService.deleteHistory(userId, new Types.ObjectId(historyId));
  }
}
