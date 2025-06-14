"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tasks_gateway_1 = require("./tasks.gateway");
let TasksService = class TasksService {
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    async createTask(userId, projectId, data) {
        const member = await this.prisma.member.findFirst({
            where: { userId, projectId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        if (data.assigneeId) {
            const assignee = await this.prisma.member.findFirst({
                where: { id: data.assigneeId, projectId },
            });
            if (!assignee) {
                throw new common_1.NotFoundException('Assignee not found in this project');
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
        this.gateway.emitTaskCreated(task);
        return task;
    }
    async getProjectTasks(projectId) {
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
    async getTaskById(taskId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async updateTask(userId, taskId, data) {
        const existingTask = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: { project: true },
        });
        if (!existingTask) {
            throw new common_1.NotFoundException('Task not found');
        }
        const member = await this.prisma.member.findFirst({
            where: { userId, projectId: existingTask.projectId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        if (data.assigneeId) {
            const assignee = await this.prisma.member.findFirst({
                where: { id: data.assigneeId, projectId: existingTask.projectId },
            });
            if (!assignee) {
                throw new common_1.NotFoundException('Assignee not found in this project');
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
        this.gateway.emitTaskUpdated(updatedTask);
        return updatedTask;
    }
    async deleteTask(userId, taskId) {
        const existingTask = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: true,
                subtasks: true
            },
        });
        if (!existingTask) {
            throw new common_1.NotFoundException('Task not found');
        }
        const member = await this.prisma.member.findFirst({
            where: { userId, projectId: existingTask.projectId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        await this.prisma.task.delete({
            where: { id: taskId }
        });
        this.gateway.emitTaskDeleted(taskId);
        return { message: 'Task deleted successfully' };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tasks_gateway_1.TasksGateway])
], TasksService);
//# sourceMappingURL=tasks.service.js.map