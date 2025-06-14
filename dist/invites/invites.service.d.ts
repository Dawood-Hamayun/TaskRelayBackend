import { PrismaService } from '../prisma/prisma.service';
export declare class InvitesService {
    private prisma;
    constructor(prisma: PrismaService);
    createInvite(email: string, projectId: string, role?: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'): Promise<{
        id: string;
        email: string;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    acceptInvite(email: string, userId: string): Promise<{
        message: string;
    }>;
    getProjectInvites(projectId: string): Promise<{
        id: string;
        email: string;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
}
