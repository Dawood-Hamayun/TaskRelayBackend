import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(email: string, password: string, name: string, inviteToken?: string): Promise<{
        access_token: string;
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            createdAt: Date;
        };
        autoAcceptedProject: {
            id: any;
            name: any;
        };
    }>;
    login(email: string, password: string, inviteToken?: string): Promise<{
        access_token: string;
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            createdAt: Date;
        };
        autoAcceptedProject: {
            id: any;
            name: any;
        };
    }>;
    private validateInviteForSignup;
    private validateInviteForLogin;
    private acceptInviteForNewUser;
    private acceptInviteForExistingUser;
    checkPendingInvites(email: string): Promise<({
        project: {
            id: string;
            name: string;
            description: string;
        };
        inviter: {
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
    validateUser(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
    }>;
}
