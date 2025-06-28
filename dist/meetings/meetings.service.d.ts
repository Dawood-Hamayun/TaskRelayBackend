import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';
import { AttendeeStatus } from '@prisma/client';
export declare class MeetingsService {
    private prisma;
    constructor(prisma: PrismaService);
    createMeeting(userId: string, projectId: string, data: CreateMeetingDto): Promise<{
        id: any;
        title: any;
        description: any;
        datetime: any;
        duration: any;
        location: any;
        meetingUrl: any;
        creator: any;
        project: any;
        attendees: any;
        createdAt: any;
    }>;
    getProjectMeetings(userId: string, projectId: string, startDate?: string, endDate?: string): Promise<{
        id: any;
        title: any;
        description: any;
        datetime: any;
        duration: any;
        location: any;
        meetingUrl: any;
        creator: any;
        project: any;
        attendees: any;
        createdAt: any;
    }[]>;
    getUserMeetings(userId: string, startDate?: string, endDate?: string): Promise<{
        id: any;
        title: any;
        description: any;
        datetime: any;
        duration: any;
        location: any;
        meetingUrl: any;
        creator: any;
        project: any;
        attendees: any;
        createdAt: any;
    }[]>;
    updateMeeting(userId: string, meetingId: string, data: UpdateMeetingDto): Promise<{
        id: any;
        title: any;
        description: any;
        datetime: any;
        duration: any;
        location: any;
        meetingUrl: any;
        creator: any;
        project: any;
        attendees: any;
        createdAt: any;
    }>;
    deleteMeeting(userId: string, meetingId: string): Promise<{
        message: string;
    }>;
    updateAttendeeStatus(userId: string, meetingId: string, status: AttendeeStatus): Promise<{
        message: string;
    }>;
    private transformMeetingData;
    private generateAvatar;
    private generateUserColor;
}
