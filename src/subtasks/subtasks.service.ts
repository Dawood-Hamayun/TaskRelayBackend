// subtasks/subtasks.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async createSubtask(userId: string, taskId: string, data: CreateSubtaskDto) {
    // Get the task to verify it exists and get project info
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify user is a member of the project
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId: task.projectId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    // If assigneeId is provided, verify the assignee is a member of the project
    if (data.assigneeId) {
      const assignee = await this.prisma.member.findFirst({
        where: { id: data.assigneeId, projectId: task.projectId },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee not found in this project');
      }
    }

    const subtask = await this.prisma.subtask.create({
      data: {
        taskId,
        title: data.title,
        assigneeId: data.assigneeId,
      },
      include: {
        assignee: { include: { user: true } },
      },
    });

    return subtask;
  }

  async updateSubtask(userId: string, subtaskId: string, data: UpdateSubtaskDto) {
    // Get the subtask to verify it exists and get task/project info
    const subtask = await this.prisma.subtask.findUnique({
      where: { id: subtaskId },
      include: { 
        task: { 
          include: { project: true } 
        } 
      },
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    // Verify user is a member of the project
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId: subtask.task.projectId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    // If assigneeId is being updated, verify the assignee is a member of the project
    if (data.assigneeId) {
      const assignee = await this.prisma.member.findFirst({
        where: { id: data.assigneeId, projectId: subtask.task.projectId },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee not found in this project');
      }
    }

    const updatedSubtask = await this.prisma.subtask.update({
      where: { id: subtaskId },
      data,
      include: {
        assignee: { include: { user: true } },
      },
    });

    return updatedSubtask;
  }

  async deleteSubtask(userId: string, subtaskId: string) {
    // Get the subtask to verify it exists and get task/project info
    const subtask = await this.prisma.subtask.findUnique({
      where: { id: subtaskId },
      include: { 
        task: { 
          include: { project: true } 
        } 
      },
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    // Verify user is a member of the project
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId: subtask.task.projectId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    await this.prisma.subtask.delete({
      where: { id: subtaskId },
    });

    return { message: 'Subtask deleted successfully' };
  }

  async createMultipleSubtasks(
    userId: string, 
    taskId: string, 
    subtasks: CreateSubtaskDto[]
  ) {
    // Get the task to verify it exists and get project info
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify user is a member of the project
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId: task.projectId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    // Create all subtasks
    const createdSubtasks = await Promise.all(
      subtasks.map(subtaskData =>
        this.prisma.subtask.create({
          data: {
            taskId,
            title: subtaskData.title,
            assigneeId: subtaskData.assigneeId,
          },
          include: {
            assignee: { include: { user: true } },
          },
        })
      )
    );

    return createdSubtasks;
  }
}