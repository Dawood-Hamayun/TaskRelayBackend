import { Role } from '@prisma/client';
export declare class CreateInviteDto {
    email: string;
    projectId: string;
    role?: Role;
    message?: string;
}
