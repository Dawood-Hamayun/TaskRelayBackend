// subtasks/dto/subtask.dto.ts
import { IsString, IsOptional, IsBoolean, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubtaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}

export class UpdateSubtaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}

export class CreateMultipleSubtasksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtaskDto)
  subtasks: CreateSubtaskDto[];
}