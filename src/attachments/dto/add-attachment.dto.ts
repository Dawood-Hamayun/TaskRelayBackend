import { IsString } from 'class-validator';

export class AddAttachmentDto {
  @IsString()
  fileName: string;

  @IsString()
  url: string;
}