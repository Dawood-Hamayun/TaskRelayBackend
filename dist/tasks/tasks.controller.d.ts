import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    createTask(req: any, projectId: string, body: CreateTaskDto): Promise<{
        project: {
            id: string;
            createdAt: Date;
            name: string;
        };
        comments: ({
            author: {
                id: string;
                email: string;
                createdAt: Date;
                name: string | null;
                password: string;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            taskId: string;
        })[];
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
        subtasks: ({
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
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            taskId: string;
            url: string;
            fileName: string;
        }[];
        tags: ({
            tag: {
                id: string;
                projectId: string;
                name: string;
                color: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        projectId: string;
        createdAt: Date;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        status: import("@prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        assigneeId: string | null;
    }>;
    getProjectTasks(req: any, projectId: string): Promise<({
        project: {
            id: string;
            createdAt: Date;
            name: string;
        };
        comments: ({
            author: {
                id: string;
                email: string;
                createdAt: Date;
                name: string | null;
                password: string;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            taskId: string;
        })[];
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
        subtasks: ({
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
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            taskId: string;
            url: string;
            fileName: string;
        }[];
        tags: ({
            tag: {
                id: string;
                projectId: string;
                name: string;
                color: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        projectId: string;
        createdAt: Date;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        status: import("@prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        assigneeId: string | null;
    })[]>;
    getTaskById(req: any, id: string): Promise<{
        project: {
            id: string;
            createdAt: Date;
            name: string;
        };
        comments: ({
            author: {
                id: string;
                email: string;
                createdAt: Date;
                name: string | null;
                password: string;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            taskId: string;
        })[];
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
        subtasks: ({
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
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            taskId: string;
            url: string;
            fileName: string;
        }[];
        tags: ({
            tag: {
                id: string;
                projectId: string;
                name: string;
                color: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        projectId: string;
        createdAt: Date;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        status: import("@prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        assigneeId: string | null;
    }>;
    updateTask(req: any, id: string, body: UpdateTaskDto): Promise<{
        project: {
            id: string;
            createdAt: Date;
            name: string;
        };
        comments: ({
            author: {
                id: string;
                email: string;
                createdAt: Date;
                name: string | null;
                password: string;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            taskId: string;
        })[];
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
        subtasks: ({
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
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            taskId: string;
            url: string;
            fileName: string;
        }[];
        tags: ({
            tag: {
                id: string;
                projectId: string;
                name: string;
                color: string;
            };
        } & {
            taskId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        projectId: string;
        createdAt: Date;
        description: string;
        title: string;
        priority: import("@prisma/client").$Enums.TaskPriority;
        status: import("@prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        assigneeId: string | null;
    }>;
    deleteTask(req: any, id: string): Promise<{
        message: string;
    }>;
}
