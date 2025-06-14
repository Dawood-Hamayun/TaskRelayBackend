import { PrismaService } from '../prisma/prisma.service';
export declare class MembersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByProject(projectId: string): Promise<({
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
    })[]>;
    findUserProjects(userId: string): Promise<({
        project: {
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        userId: string;
    })[]>;
}
