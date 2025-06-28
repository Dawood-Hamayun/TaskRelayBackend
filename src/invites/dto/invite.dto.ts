// backend/src/invites/dto/invite.dto.ts
import { IsEmail, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateInviteDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsEnum(Role, { message: 'Invalid role specified' })
  @IsOptional()
  role?: Role = 'MEMBER';

  @IsOptional()
  @MaxLength(500, { message: 'Message must be less than 500 characters' })
  message?: string;
}
