import { PrismaService } from '../prisma/prisma.service';
import { TasksGateway } from './tasks.gateway';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: TasksGateway);
    createTask(userId: string, projectId: string, data: CreateTaskDto): Promise<{
        project: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
        };
        comments: ({
            author: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            taskId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                name: string;
                projectId: string;
                color: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
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
        subtasks: ({
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
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            taskId: string;
            url: string;
            fileName: string;
            fileSize: number | null;
            mimeType: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        assigneeId: string | null;
        updatedAt: Date;
    }>;
    getProjectTasks(projectId: string): Promise<({
        project: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
        };
        comments: ({
            author: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            taskId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                name: string;
                projectId: string;
                color: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
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
        subtasks: ({
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
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            taskId: string;
            url: string;
            fileName: string;
            fileSize: number | null;
            mimeType: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        assigneeId: string | null;
        updatedAt: Date;
    })[]>;
    getTaskById(taskId: string): Promise<{
        project: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
        };
        comments: ({
            author: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            taskId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                name: string;
                projectId: string;
                color: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
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
        subtasks: ({
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
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            taskId: string;
            url: string;
            fileName: string;
            fileSize: number | null;
            mimeType: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        assigneeId: string | null;
        updatedAt: Date;
    }>;
    updateTask(userId: string, taskId: string, data: UpdateTaskDto): Promise<{
        project: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
        };
        comments: ({
            author: {
                id: string;
                email: string;
                password: string;
                name: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            taskId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                name: string;
                projectId: string;
                color: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
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
        subtasks: ({
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
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            taskId: string;
            url: string;
            fileName: string;
            fileSize: number | null;
            mimeType: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        assigneeId: string | null;
        updatedAt: Date;
    }>;
    deleteTask(userId: string, taskId: string): Promise<{
        message: string;
    }>;
}
