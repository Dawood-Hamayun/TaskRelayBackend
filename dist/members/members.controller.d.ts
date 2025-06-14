import { MembersService } from './members.service';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    findByProject(projectId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        projectId: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        userId: string;
    })[]>;
}
