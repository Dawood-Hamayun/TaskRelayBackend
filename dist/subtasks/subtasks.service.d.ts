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
                createdAt: Date;
                name: string | null;
                password: string;
            };
        } & {
            id: string;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
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
                createdAt: Date;
                name: string | null;
                password: string;
            };
        } & {
            id: string;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
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
                createdAt: Date;
                name: string | null;
                password: string;
            };
        } & {
            id: string;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        assigneeId: string | null;
        taskId: string;
        completed: boolean;
    })[]>;
}
