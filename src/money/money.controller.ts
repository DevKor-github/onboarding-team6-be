import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { MoneyService } from './money.service';
import { CreateMoneyDto, AddHistoryDto, UpdateHistoryDto } from './money.dto';
import { Types } from 'mongoose';
import { ApiOkResponse, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Money } from './money.schema';

@ApiTags('money')
@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}

  @ApiOperation({ summary: '내 잔고 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiOkResponse({ type: Money }) 
  @Post()
  async create(@Body() createMoneyDto: CreateMoneyDto): Promise<Money> { 
    return this.moneyService.create(createMoneyDto);
  }

///userId는 _id를 의미함
  @ApiOperation({ summary: '내 잔고 조회' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Get(':userId')
  async getMoney(@Param('userId') userId: string) {
    return this.moneyService.findByUserId(new Types.ObjectId(userId));
  }

  @ApiOperation({ summary: '지출/수입 내역 등록' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiOkResponse({ type: AddHistoryDto })
  @Post(':userId/history')
  async addHistory(@Param('userId') userId: string, @Body() addHistoryDto: AddHistoryDto) {
    return this.moneyService.addHistory(new Types.ObjectId(userId), addHistoryDto);
  }

  ///historyId는 사용자의 지출/수입 내역 중 특정 내역을 의미함
  @ApiOperation({ summary: '지출/수입 내역 수정 - 특정 내역 수정' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiOkResponse({ type: UpdateHistoryDto })
  @Put(':userId/history/:historyId')
  async updateHistory(@Param('userId') userId: string, @Param('historyId') historyId: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    return this.moneyService.updateHistory(new Types.ObjectId(userId), new Types.ObjectId(historyId), updateHistoryDto);
  }

  @ApiOperation({ summary: '지출/수입 내역 삭제 - 특정 내역 삭제' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Delete(':userId/history/:historyId')
  async deleteHistory(@Param('userId') userId: string, @Param('historyId') historyId: string) {
    return this.moneyService.deleteHistory(new Types.ObjectId(userId), new Types.ObjectId(historyId));
  }
}
