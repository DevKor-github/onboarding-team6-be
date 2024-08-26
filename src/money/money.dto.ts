import { IsString, IsNotEmpty, IsEnum, IsNumberString, IsOptional } from 'class-validator';
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

  @IsNumberString()
  @IsNotEmpty()
  amount: string;

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

  @IsNumberString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsOptional()
  date?: string;
}
