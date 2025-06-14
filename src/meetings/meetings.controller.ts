import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScheduleMeetingDto } from './dto/schedule-meeting.dto';

@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post(':projectId')
  scheduleMeeting(
    @Param('projectId') projectId: string,
    @Body() body: ScheduleMeetingDto
  ) {
    return this.meetingsService.scheduleMeeting(projectId, body.title, new Date(body.datetime));
  }

  @Get(':projectId')
  getProjectMeetings(@Param('projectId') projectId: string) {
    return this.meetingsService.getProjectMeetings(projectId);
  }
}