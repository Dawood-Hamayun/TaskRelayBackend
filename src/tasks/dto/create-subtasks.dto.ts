// tasks/dto/create-subtasks.dto.ts
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SubtaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}

export class CreateSubtasksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubtaskDto)
  subtasks: SubtaskDto[];
}
