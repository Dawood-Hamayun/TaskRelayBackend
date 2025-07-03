import { UsersService } from './users.service';
import { UpdateUserDto, UpdatePasswordDto, UpdateProfilePictureDto, DeleteAccountDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
    }[]>;
    getCurrentUser(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
        _count: {
            members: number;
            comments: number;
            sentInvites: number;
            createdMeetings: number;
        };
    }>;
    getUserStats(req: any): Promise<{
        totalProjects: number;
        totalTasks: number;
        completedTasks: number;
        inProgressTasks: number;
        overdueTasks: number;
        totalComments: number;
        sentInvites: number;
        createdMeetings: number;
        completionRate: number;
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
        _count: {
            members: number;
            comments: number;
            sentInvites: number;
            createdMeetings: number;
        };
    }>;
    updatePassword(req: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    updateAvatar(req: any, updateAvatarDto: UpdateProfilePictureDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
        _count: {
            members: number;
            comments: number;
            sentInvites: number;
            createdMeetings: number;
        };
    }>;
    removeAvatar(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
        _count: {
            members: number;
            comments: number;
            sentInvites: number;
            createdMeetings: number;
        };
    }>;
    deleteAccount(req: any, deleteAccountDto: DeleteAccountDto): Promise<{
        message: string;
    }>;
}
