import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: SignupDto, inviteToken?: string): Promise<{
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
    login(body: LoginDto, inviteToken?: string): Promise<{
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
}
