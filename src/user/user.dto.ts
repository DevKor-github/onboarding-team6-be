import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class CreateUserDto {
  @ApiProperty({
    description: '유저명-중복불가',
    example: '존, john (영어 한글 둘다)',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '비밀번호', example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '프로필 사진 URL',
    example: 'S3링크',
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({
    description: '한줄 소개',
    example: '안녕하세요! 반갑습니다.거지에요.',
  })
  @IsOptional()
  @IsString()
  bio?: string;
}

// 사용자 조회에 사용될 DTO (비밀번호 제외)
export class UserDto {
  @ApiProperty({
    description: '유저명-중복불가',
    example: '존, john (영어 한글 둘다)',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '프로필 사진 URL',
    example: 'S3링크',
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({
    description: '한줄 소개',
    example: '안녕하세요! 반갑습니다.거지에요.',
  })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class ChangePictureDto {
  @ApiProperty({
    description: '새로운 프로필 사진 URL',
    example: 'https://example.com/new-picture.jpg',
  })
  @IsString()
  @IsOptional() // 사진 URL이 없는 경우도 있을 수 있으므로 optional로 설정
  profilePicture?: string;
}

export class ChangeOtherDto {
  @ApiProperty({
    description: '한줄 소개',
    example: '안녕하세요! 새로운 한줄 소개입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: '유저명-중복불가',
    example: '존, john (영어 한글 둘다)',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '비밀번호', example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class ChatUserDto {
  @ApiProperty({
    description: '사용자 ID',
    example: '123456789(유저_id)',
  })
  id: Types.ObjectId;

  @ApiProperty({
    description: '사용자 이름',
    example: 'John Doe',
  })
  username: string;

  @ApiProperty({
    description: '프로필 사진 URL',
    example: 'S3링크',
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
