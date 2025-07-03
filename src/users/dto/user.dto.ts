// backend/src/users/dto/user.dto.ts - Debug version with better validation
import { IsEmail, IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UpdateProfilePictureDto {
  @IsString({ message: 'Avatar must be a string' })
  // Temporarily remove the regex validation to see if that's the issue
  // @Matches(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, {
  //   message: 'Avatar must be a valid base64 encoded image (JPEG, PNG, GIF, or WebP)'
  // })
  avatar: string;
}

export class DeleteAccountDto {
  @IsString()
  @MinLength(6)
  password: string;
}