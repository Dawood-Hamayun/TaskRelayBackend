// backend/src/comments/comments.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':taskId')
  createComment(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body() body: CreateCommentDto
  ) {
    return this.commentsService.createComment(req.user.userId, taskId, body.content);
  }

  @Get(':taskId')
  getTaskComments(@Param('taskId') taskId: string) {
    return this.commentsService.getTaskComments(taskId);
  }

  @Delete(':commentId')
  deleteComment(@Request() req, @Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(commentId, req.user.userId);
  }
}