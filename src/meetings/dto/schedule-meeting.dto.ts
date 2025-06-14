import { IsString, IsISO8601 } from 'class-validator';

export class ScheduleMeetingDto {
  @IsString()
  title: string;

  @IsISO8601()
  datetime: string;
}