import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';
import { AttendeeStatus } from '@prisma/client';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    createMeeting(projectId: string, createMeetingDto: CreateMeetingDto, req: any): Promise<{
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
    getUserMeetings(req: any, startDate?: string, endDate?: string): Promise<{
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
    getProjectMeetings(projectId: string, req: any, startDate?: string, endDate?: string): Promise<{
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
    updateMeeting(meetingId: string, updateMeetingDto: UpdateMeetingDto, req: any): Promise<{
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
    deleteMeeting(meetingId: string, req: any): Promise<{
        message: string;
    }>;
    respondToMeeting(meetingId: string, body: {
        status: AttendeeStatus;
    }, req: any): Promise<{
        message: string;
    }>;
}
