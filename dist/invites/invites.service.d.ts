import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { Role } from '@prisma/client';
export declare class InvitesService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    createInvite(email: string, projectId: string, invitedBy: string, role?: Role, message?: string): Promise<{
        project: {
            id: string;
            name: string;
            description: string;
        };
        inviter: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        token: string;
        status: import("@prisma/client").$Enums.InviteStatus;
        invitedBy: string;
        message: string | null;
        expiresAt: Date;
    }>;
    getInviteByToken(token: string): Promise<{
        project: {
            id: string;
            name: string;
            description: string;
        };
        inviter: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        token: string;
        status: import("@prisma/client").$Enums.InviteStatus;
        invitedBy: string;
        message: string | null;
        expiresAt: Date;
    }>;
    acceptInvite(token: string, userId: string): Promise<{
        message: string;
        member: {
            user: {
                id: string;
                email: string;
                name: string;
            };
            project: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            userId: string;
        };
        project: {
            id: string;
            name: string;
            description: string;
        };
    }>;
    declineInvite(token: string): Promise<{
        message: string;
    }>;
    getProjectInvites(projectId: string, userId: string): Promise<({
        inviter: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        token: string;
        status: import("@prisma/client").$Enums.InviteStatus;
        invitedBy: string;
        message: string | null;
        expiresAt: Date;
    })[]>;
    cancelInvite(inviteId: string, userId: string): Promise<{
        message: string;
    }>;
    resendInvite(inviteId: string, userId: string): Promise<{
        message: string;
        invite: {
            project: {
                id: string;
                name: string;
                description: string;
            };
            inviter: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            email: string;
            createdAt: Date;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            token: string;
            status: import("@prisma/client").$Enums.InviteStatus;
            invitedBy: string;
            message: string | null;
            expiresAt: Date;
        };
    }>;
}
