// backend/src/meetings/dto/meeting.dto.ts
import { IsString, IsOptional, IsDateString, IsNumber, IsArray, IsUrl, IsNotEmpty, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  datetime: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(480) // Max 8 hours
  @Transform(({ value }) => parseInt(value))
  duration?: number = 60;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  meetingUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attendeeIds?: string[];
}

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  datetime?: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(480)
  @Transform(({ value }) => parseInt(value))
  duration?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  meetingUrl?: string;
}

export class MeetingResponseDto {
  @IsNotEmpty()
  @IsString()
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
}

// Project DTOs
export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}