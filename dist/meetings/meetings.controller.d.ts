import { MeetingsService } from './meetings.service';
import { ScheduleMeetingDto } from './dto/schedule-meeting.dto';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    scheduleMeeting(projectId: string, body: ScheduleMeetingDto): Promise<{
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
