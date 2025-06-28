// backend/src/tasks/tasks.service.ts - COMPLETE VERSION
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

    // Create the task first
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
    });

    // Handle tags if provided
    if (data.tags && data.tags.length > 0) {
      // Verify all tags belong to the project
      const validTags = await this.prisma.tag.findMany({
        where: {
          id: { in: data.tags },
          projectId,
        },
      });

      if (validTags.length !== data.tags.length) {
        throw new NotFoundException('One or more tags not found in this project');
      }

      // Create tag associations
      await this.prisma.taskTag.createMany({
        data: data.tags.map(tagId => ({
          taskId: task.id,
          tagId,
        })),
      });
    }

    // Return the complete task with all relations
    const completeTask = await this.getTaskById(task.id);

    // Emit socket event for real-time updates
    this.gateway.emitTaskCreated(completeTask);
    
    return completeTask;
  }

  async getProjectTasks(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { include: { user: true } },
        project: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' }
        },
        tags: { 
          include: { 
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                projectId: true
              }
            }
          }
        },
        subtasks: {
          include: {
            assignee: { include: { user: true } },
          },
          orderBy: { createdAt: 'asc' }
        },
        attachments: true,
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
        project: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' }
        },
        tags: { 
          include: { 
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                projectId: true
              }
            }
          }
        },
        subtasks: {
          include: {
            assignee: { include: { user: true } },
          },
          orderBy: { createdAt: 'asc' }
        },
        attachments: true,
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

    // Handle tags update
    if (data.tags !== undefined) {
      // Remove existing tag associations
      await this.prisma.taskTag.deleteMany({
        where: { taskId },
      });

      // Add new tag associations if any
      if (data.tags.length > 0) {
        // Verify all tags belong to the project
        const validTags = await this.prisma.tag.findMany({
          where: {
            id: { in: data.tags },
            projectId: existingTask.projectId,
          },
        });

        if (validTags.length !== data.tags.length) {
          throw new NotFoundException('One or more tags not found in this project');
        }

        // Create new tag associations
        await this.prisma.taskTag.createMany({
          data: data.tags.map(tagId => ({
            taskId,
            tagId,
          })),
        });
      }
    }

    // Update the task (excluding tags from the direct update)
    const { tags, ...updateData } = data;
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...updateData,
        dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
      },
    });

    // Get the complete updated task with all relations
    const completeUpdatedTask = await this.getTaskById(taskId);

    // Emit socket event for real-time updates
    this.gateway.emitTaskUpdated(completeUpdatedTask);
    
    return completeUpdatedTask;
  }

  async deleteTask(userId: string, taskId: string) {
    // Get the task to verify it exists and get project info
    const existingTask = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { 
        project: true,
        subtasks: true
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

    // Delete task tags first (cascade should handle this, but being explicit)
    await this.prisma.taskTag.deleteMany({
      where: { taskId },
    });

    // Delete the task (subtasks will cascade delete due to onDelete: Cascade in schema)
    await this.prisma.task.delete({ 
      where: { id: taskId } 
    });

    // Emit socket event for real-time updates
    this.gateway.emitTaskDeleted(taskId);
    
    return { message: 'Task deleted successfully' };
  }
}