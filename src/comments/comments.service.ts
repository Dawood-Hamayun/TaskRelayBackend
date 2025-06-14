// backend/src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(userId: string, taskId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        authorId: userId,
        taskId,
      },
      include: {
        author: true
      }
    });
  }

  async getTaskComments(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async deleteComment(commentId: string, userId: string) {
    // Only allow the author to delete their comment
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment || comment.authorId !== userId) {
      throw new Error('Unauthorized to delete this comment');
    }

    return this.prisma.comment.delete({
      where: { id: commentId }
    });
  }
}
