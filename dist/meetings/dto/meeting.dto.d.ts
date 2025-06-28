export declare class CreateMeetingDto {
    title: string;
    description?: string;
    datetime: string;
    duration?: number;
    location?: string;
    meetingUrl?: string;
    attendeeIds?: string[];
}
export declare class UpdateMeetingDto {
    title?: string;
    description?: string;
    datetime?: string;
    duration?: number;
    location?: string;
    meetingUrl?: string;
}
export declare class MeetingResponseDto {
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
}
export declare class CreateProjectDto {
    name: string;
    description?: string;
}
export declare class UpdateProjectDto {
    name?: string;
    description?: string;
}
