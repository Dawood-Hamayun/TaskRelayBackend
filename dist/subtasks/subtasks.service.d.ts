import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';
export declare class SubtasksService {
    private prisma;
    constructor(prisma: PrismaService);
    createSubtask(userId: string, taskId: string, data: CreateSubtaskDto): Promise<{
        assignee: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                avatar: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assigneeId: string | null;
        taskId: string;
        completed: boolean;
    }>;
    updateSubtask(userId: string, subtaskId: string, data: UpdateSubtaskDto): Promise<{
        assignee: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                avatar: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assigneeId: string | null;
        taskId: string;
        completed: boolean;
    }>;
    deleteSubtask(userId: string, subtaskId: string): Promise<{
        message: string;
    }>;
    createMultipleSubtasks(userId: string, taskId: string, subtasks: CreateSubtaskDto[]): Promise<({
        assignee: {
            user: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                avatar: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assigneeId: string | null;
        taskId: string;
        completed: boolean;
    })[]>;
}
