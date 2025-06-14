// backend/src/tags/dto/create-tag.dto.ts
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(1, { message: 'Tag name is required' })
  @MaxLength(50, { message: 'Tag name is too long' })
  name: string;

  @IsString()
  @Matches(/^(blue|purple|emerald|red|amber|orange|gray)$/, {
    message: 'Color must be one of: blue, purple, emerald, red, amber, orange, gray'
  })
  color: string;
}