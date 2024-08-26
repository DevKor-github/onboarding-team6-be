import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateMoneyDto {
  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  total: string;
}

export class AddHistoryDto {
  @IsEnum(['spend', 'earn'])
  type: 'spend' | 'earn';

  @IsString()
  @IsNotEmpty()
  memo: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  date: string;
}

export class UpdateHistoryDto {
  @IsOptional()
  @IsEnum(['spend', 'earn'])
  type?: 'spend' | 'earn';

  @IsString()
  @IsOptional()
  memo?: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  date?: string;
}
