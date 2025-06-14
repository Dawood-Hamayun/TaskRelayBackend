import { PrismaService } from '../prisma/prisma.service';
export declare class MeetingsService {
    private prisma;
    constructor(prisma: PrismaService);
    scheduleMeeting(projectId: string, title: string, datetime: Date): Promise<{
        id: string;
        projectId: string;
        createdAt: Date;
        title: string;
        datetime: Date;
    }>;
    getProjectMeetings(projectId: string): Promise<{
        id: string;
        projectId: string;
        createdAt: Date;
        title: string;
        datetime: Date;
    }[]>;
}
