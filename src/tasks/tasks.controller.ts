// tasks/tasks.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':projectId')
  createTask(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() body: CreateTaskDto
  ) {
    return this.tasksService.createTask(req.user.userId, projectId, body);
  }

  @Get(':projectId')
  getProjectTasks(
    @Request() req,
    @Param('projectId') projectId: string
  ) {
    return this.tasksService.getProjectTasks(projectId);
  }

  @Get('task/:id')
  getTaskById(
    @Request() req,
    @Param('id') id: string
  ) {
    return this.tasksService.getTaskById(id);
  }

  @Patch(':id')
  updateTask(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto
  ) {
    return this.tasksService.updateTask(req.user.userId, id, body);
  }

  @Delete(':id')
  deleteTask(
    @Request() req, 
    @Param('id') id: string
  ) {
    return this.tasksService.deleteTask(req.user.userId, id);
  }
}