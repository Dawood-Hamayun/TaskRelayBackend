import { InvitesService } from './invites.service';
export declare class InvitesController {
    private readonly invitesService;
    constructor(invitesService: InvitesService);
    createInvite(req: any, projectId: string, body: {
        email: string;
        role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
    }): Promise<{
        id: string;
        email: string;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    acceptInvite(req: any): Promise<{
        message: string;
    }>;
    getInvites(projectId: string): Promise<{
        id: string;
        email: string;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
}
