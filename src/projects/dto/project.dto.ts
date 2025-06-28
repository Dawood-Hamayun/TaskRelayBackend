// backend/src/projects/dto/project.dto.ts
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @MaxLength(100, { message: 'Project name must be less than 100 characters' })
  name: string;

  @IsOptional()
  @MaxLength(500, { message: 'Project description must be less than 500 characters' })
  description?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @MaxLength(100, { message: 'Project name must be less than 100 characters' })
  name?: string;

  @IsOptional()
  @MaxLength(500, { message: 'Project description must be less than 500 characters' })
  description?: string;
}