import { PrismaService } from '../prisma/prisma.service';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProject(userId: string, name: string, description?: string): Promise<{
        id: any;
        name: any;
        description: any;
        members: any;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            overdue: number;
            todo: number;
        };
        meetings: any;
        tags: any;
        createdAt: any;
        lastActivity: any;
        status: "completed" | "active" | "archived";
        _count: any;
    }>;
    getUserProjects(userId: string): Promise<{
        id: any;
        name: any;
        description: any;
        members: any;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            overdue: number;
            todo: number;
        };
        meetings: any;
        tags: any;
        createdAt: any;
        lastActivity: any;
        status: "completed" | "active" | "archived";
        _count: any;
    }[]>;
    getProjectById(projectId: string, userId: string): Promise<{
        id: any;
        name: any;
        description: any;
        members: any;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            overdue: number;
            todo: number;
        };
        meetings: any;
        tags: any;
        createdAt: any;
        lastActivity: any;
        status: "completed" | "active" | "archived";
        _count: any;
    }>;
    updateProject(projectId: string, userId: string, data: {
        name?: string;
        description?: string;
    }): Promise<{
        id: any;
        name: any;
        description: any;
        members: any;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            overdue: number;
            todo: number;
        };
        meetings: any;
        tags: any;
        createdAt: any;
        lastActivity: any;
        status: "completed" | "active" | "archived";
        _count: any;
    }>;
    deleteProject(projectId: string, userId: string): Promise<{
        message: string;
    }>;
    private transformProjectData;
    private calculateTaskStats;
    private calculateLastActivity;
    private determineProjectStatus;
    private generateAvatar;
    private generateUserColor;
}
