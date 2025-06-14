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
exports.SubtasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubtasksService = class SubtasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSubtask(userId, taskId, data) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: { project: true },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        const member = await this.prisma.member.findFirst({
            where: { userId, projectId: task.projectId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        if (data.assigneeId) {
            const assignee = await this.prisma.member.findFirst({
                where: { id: data.assigneeId, projectId: task.projectId },
            });
            if (!assignee) {
                throw new common_1.NotFoundException('Assignee not found in this project');
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
    async updateSubtask(userId, subtaskId, data) {
        const subtask = await this.prisma.subtask.findUnique({
            where: { id: subtaskId },
            include: {
                task: {
                    include: { project: true }
                }
            },
        });
        if (!subtask) {
            throw new common_1.NotFoundException('Subtask not found');
        }
        const member = await this.prisma.member.findFirst({
            where: { userId, projectId: subtask.task.projectId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        if (data.assigneeId) {
            const assignee = await this.prisma.member.findFirst({
                where: { id: data.assigneeId, projectId: subtask.task.projectId },
            });
            if (!assignee) {
                throw new common_1.NotFoundException('Assignee not found in this project');
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
    async deleteSubtask(userId, subtaskId) {
        const subtask = await this.prisma.subtask.findUnique({
            where: { id: subtaskId },
            include: {
                task: {
                    include: { project: true }
                }
            },
        });
        if (!subtask) {
            throw new common_1.NotFoundException('Subtask not found');
        }
        const member = await this.prisma.member.findFirst({
            where: { userId, projectId: subtask.task.projectId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        await this.prisma.subtask.delete({
            where: { id: subtaskId },
        });
        return { message: 'Subtask deleted successfully' };
    }
    async createMultipleSubtasks(userId, taskId, subtasks) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: { project: true },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        const member = await this.prisma.member.findFirst({
            where: { userId, projectId: task.projectId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        const createdSubtasks = await Promise.all(subtasks.map(subtaskData => this.prisma.subtask.create({
            data: {
                taskId,
                title: subtaskData.title,
                assigneeId: subtaskData.assigneeId,
            },
            include: {
                assignee: { include: { user: true } },
            },
        })));
        return createdSubtasks;
    }
};
exports.SubtasksService = SubtasksService;
exports.SubtasksService = SubtasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubtasksService);
//# sourceMappingURL=subtasks.service.js.map