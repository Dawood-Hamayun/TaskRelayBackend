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
                createdAt: Date;
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
        title: string;
        assigneeId: string | null;
        updatedAt: Date;
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
                createdAt: Date;
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
        title: string;
        assigneeId: string | null;
        updatedAt: Date;
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
                createdAt: Date;
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
        title: string;
        assigneeId: string | null;
        updatedAt: Date;
        taskId: string;
        completed: boolean;
    })[]>;
}
