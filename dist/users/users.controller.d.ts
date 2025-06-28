import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(req: any): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
    }[]>;
}
