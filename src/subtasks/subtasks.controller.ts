// subtasks/subtasks.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Request } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSubtaskDto, UpdateSubtaskDto, CreateMultipleSubtasksDto } from './dto/subtask.dto';

@UseGuards(JwtAuthGuard)
@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post('task/:taskId')
  createSubtask(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body() body: CreateSubtaskDto
  ) {
    return this.subtasksService.createSubtask(req.user.userId, taskId, body);
  }

  @Post('task/:taskId/multiple')
  createMultipleSubtasks(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body() body: CreateMultipleSubtasksDto
  ) {
    return this.subtasksService.createMultipleSubtasks(req.user.userId, taskId, body.subtasks);
  }

  @Patch(':id')
  updateSubtask(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateSubtaskDto
  ) {
    return this.subtasksService.updateSubtask(req.user.userId, id, body);
  }

  @Delete(':id')
  deleteSubtask(
    @Request() req,
    @Param('id') id: string
  ) {
    return this.subtasksService.deleteSubtask(req.user.userId, id);
  }
}