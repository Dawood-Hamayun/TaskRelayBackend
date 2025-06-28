import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/invite.dto';
export declare class InvitesController {
    private readonly invitesService;
    constructor(invitesService: InvitesService);
    createInvite(req: any, createInviteDto: CreateInviteDto): Promise<{
        message: string;
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
        id: string;
        email: string;
        createdAt: Date;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.InviteStatus;
        invitedBy: string;
        expiresAt: Date;
    }>;
    getInvite(token: string): Promise<{
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
        email: string;
        createdAt: Date;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        token: string;
        status: import("@prisma/client").$Enums.InviteStatus;
        message: string | null;
        expiresAt: Date;
    }>;
    acceptInvite(token: string, req: any): Promise<{
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
    getProjectInvites(projectId: string, req: any): Promise<({
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
    cancelInvite(inviteId: string, req: any): Promise<{
        message: string;
    }>;
    resendInvite(inviteId: string, req: any): Promise<{
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
