import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(req: any): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        name: string | null;
        password: string;
    }[]>;
}
