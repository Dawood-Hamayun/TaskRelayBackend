import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    createTask(req: any, projectId: string, body: CreateTaskDto): Promise<{
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        comments: ({
            author: {
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
        subtasks: ({
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
        updatedAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        assigneeId: string | null;
    }>;
    getProjectTasks(req: any, projectId: string): Promise<({
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        comments: ({
            author: {
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
        subtasks: ({
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
        updatedAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        assigneeId: string | null;
    })[]>;
    getTaskById(req: any, id: string): Promise<{
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        comments: ({
            author: {
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
        subtasks: ({
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
        updatedAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        assigneeId: string | null;
    }>;
    updateTask(req: any, id: string, body: UpdateTaskDto): Promise<{
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        comments: ({
            author: {
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
        subtasks: ({
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
        updatedAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        assigneeId: string | null;
    }>;
    deleteTask(req: any, id: string): Promise<{
        message: string;
    }>;
}
