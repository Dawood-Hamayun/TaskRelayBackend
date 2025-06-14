import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  async addAttachment(taskId: string, fileName: string, url: string) {
    return this.prisma.attachment.create({
      data: {
        taskId,
        fileName,
        url,
      },
    });
  }

  async getTaskAttachments(taskId: string) {
    return this.prisma.attachment.findMany({
      where: { taskId }
    });
  }
}