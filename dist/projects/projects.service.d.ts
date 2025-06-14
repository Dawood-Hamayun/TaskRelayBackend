import { PrismaService } from '../prisma/prisma.service';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProject(userId: string, name: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
    }>;
    getUserProjects(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
        })[];
        _count: {
            members: number;
            tasks: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
    })[]>;
}
