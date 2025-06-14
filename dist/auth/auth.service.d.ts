import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { InvitesService } from '../invites/invites.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private invitesService;
    constructor(prisma: PrismaService, jwtService: JwtService, invitesService: InvitesService);
    signup(email: string, password: string, name: string): Promise<{
        access_token: string;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
}
