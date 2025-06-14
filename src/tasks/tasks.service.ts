// tasks/tasks.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TasksGateway } from './tasks.gateway';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private gateway: TasksGateway,
  ) {}

  async createTask(userId: string, projectId: string, data: CreateTaskDto) {
    // Verify user is a member of the project
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    // If assigneeId is provided, verify the assignee is a member of the project
    if (data.assigneeId) {
      const assignee = await this.prisma.member.findFirst({
        where: { id: data.assigneeId, projectId },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee not found in this project');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        projectId,
        title: data.title,
        description: data.description ?? '',
        priority: data.priority ?? 'MEDIUM',
        status: data.status ?? 'TODO',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assigneeId: data.assigneeId,
      },
      include: {
        assignee: { include: { user: true } },
        tags: { include: { tag: true } },
        comments: { include: { author: true } },
        attachments: true,
        subtasks: {
          include: {
            assignee: { include: { user: true } },
          }
        },
        project: true,
      },
    });

    // Emit socket event for real-time updates
    this.gateway.emitTaskCreated(task);
    
    return task;
  }

  async getProjectTasks(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { include: { user: true } },
        tags: { include: { tag: true } },
        comments: { include: { author: true } },
        attachments: true,
        subtasks: {
          include: {
            assignee: { include: { user: true } },
          }
        },
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks;
  }

  async getTaskById(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { include: { user: true } },
        tags: { include: { tag: true } },
        comments: { include: { author: true } },
        attachments: true,
        subtasks: {
          include: {
            assignee: { include: { user: true } },
          }
        },
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskDto) {
    // Get the task to verify it exists and get project info
    const existingTask = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    // Verify user is a member of the project
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId: existingTask.projectId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    // If assigneeId is being updated, verify the assignee is a member of the project
    if (data.assigneeId) {
      const assignee = await this.prisma.member.findFirst({
        where: { id: data.assigneeId, projectId: existingTask.projectId },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee not found in this project');
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: {
        assignee: { include: { user: true } },
        tags: { include: { tag: true } },
        comments: { include: { author: true } },
        attachments: true,
        subtasks: {
          include: {
            assignee: { include: { user: true } },
          }
        },
        project: true,
      },
    });

    // Emit socket event for real-time updates
    this.gateway.emitTaskUpdated(updatedTask);
    
    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string) {
    // Get the task to verify it exists and get project info
    const existingTask = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { 
        project: true,
        subtasks: true // Subtasks will cascade delete automatically
      },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    // Verify user is a member of the project
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId: existingTask.projectId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    // Delete the task (subtasks will cascade delete due to onDelete: Cascade in schema)
    await this.prisma.task.delete({ 
      where: { id: taskId } 
    });

    // Emit socket event for real-time updates
    this.gateway.emitTaskDeleted(taskId);
    
    return { message: 'Task deleted successfully' };
  }
}