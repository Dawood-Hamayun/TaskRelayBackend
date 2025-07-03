// backend/src/projects/dto/project.dto.ts - Enhanced with better validation
import { IsNotEmpty, IsOptional, MaxLength, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'Project name is required' })
  @IsString({ message: 'Project name must be a string' })
  @MaxLength(100, { message: 'Project name must be less than 100 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name: string;

  @IsOptional()
  @IsString({ message: 'Project description must be a string' })
  @MaxLength(500, { message: 'Project description must be less than 500 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  description?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString({ message: 'Project name must be a string' })
  @MaxLength(100, { message: 'Project name must be less than 100 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name?: string;

  @IsOptional()
  @IsString({ message: 'Project description must be a string' })
  @MaxLength(500, { message: 'Project description must be less than 500 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  description?: string;
}