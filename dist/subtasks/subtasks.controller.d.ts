import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto, UpdateSubtaskDto, CreateMultipleSubtasksDto } from './dto/subtask.dto';
export declare class SubtasksController {
    private readonly subtasksService;
    constructor(subtasksService: SubtasksService);
    createSubtask(req: any, taskId: string, body: CreateSubtaskDto): Promise<{
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
    createMultipleSubtasks(req: any, taskId: string, body: CreateMultipleSubtasksDto): Promise<({
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
    updateSubtask(req: any, id: string, body: UpdateSubtaskDto): Promise<{
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
    deleteSubtask(req: any, id: string): Promise<{
        message: string;
    }>;
}
