import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class MembersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    updateMemberRole(projectId: string, memberId: string, newRole: Role, requestingUserId: string): Promise<{
        user: {
            avatar: string;
            color: string;
            id: string;
            email: string;
            name: string;
        };
        id: string;
        createdAt: Date;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        userId: string;
    }>;
    removeMember(projectId: string, memberId: string, requestingUserId: string): Promise<{
        message: string;
    }>;
    private transferOwnership;
    private canChangeRole;
    private canRemoveMember;
    private generateAvatar;
    private generateUserColor;
}
