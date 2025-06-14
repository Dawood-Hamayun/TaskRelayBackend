import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddAttachmentDto } from './dto/add-attachment.dto';

@UseGuards(JwtAuthGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':taskId')
  addAttachment(
    @Param('taskId') taskId: string,
    @Body() body: AddAttachmentDto
  ) {
    return this.attachmentsService.addAttachment(taskId, body.fileName, body.url);
  }

  @Get(':taskId')
  getTaskAttachments(@Param('taskId') taskId: string) {
    return this.attachmentsService.getTaskAttachments(taskId);
  }
}