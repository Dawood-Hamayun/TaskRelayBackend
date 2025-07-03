import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, UpdatePasswordDto, UpdateProfilePictureDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
    }[]>;
    getCurrentUser(userId: string): Promise<{
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
    updateProfile(userId: string, updateData: UpdateUserDto): Promise<{
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
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    updateAvatar(userId: string, updateAvatarDto: UpdateProfilePictureDto): Promise<{
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
    removeAvatar(userId: string): Promise<{
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
    deleteAccount(userId: string, password: string): Promise<{
        message: string;
    }>;
    getUserStats(userId: string): Promise<{
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
}
