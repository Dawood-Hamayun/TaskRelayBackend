import { MembersService } from './members.service';
import { Role } from '@prisma/client';
interface UpdateMemberRoleDto {
    role: Role;
    projectId: string;
}
export declare class MembersController {
    private readonly membersService;
    private readonly logger;
    constructor(membersService: MembersService);
    updateMemberRole(memberId: string, updateMemberRoleDto: UpdateMemberRoleDto, req: any): Promise<{
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
    removeMember(memberId: string, projectId: string, req: any): Promise<{
        message: string;
    }>;
}
export {};
