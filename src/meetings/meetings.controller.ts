// backend/src/meetings/meetings.controller.ts - FINAL FIX
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';
import { AttendeeStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post(':projectId')
  @HttpCode(HttpStatus.CREATED)
  async createMeeting(
    @Param('projectId') projectId: string,
    @Body() createMeetingDto: CreateMeetingDto,
    @Request() req
  ) {
    return await this.meetingsService.createMeeting(
      req.user.userId,
      projectId,
      createMeetingDto
    );
  }

  @Get('user')
  async getUserMeetings(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return await this.meetingsService.getUserMeetings(
      req.user.userId,
      startDate,
      endDate
    );
  }

  @Get('project/:projectId')
  async getProjectMeetings(
    @Param('projectId') projectId: string,
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return await this.meetingsService.getProjectMeetings(
      req.user.userId,
      projectId,
      startDate,
      endDate
    );
  }

  @Put(':meetingId')
  async updateMeeting(
    @Param('meetingId') meetingId: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @Request() req
  ) {
    return await this.meetingsService.updateMeeting(
      req.user.userId,
      meetingId,
      updateMeetingDto
    );
  }

  @Delete(':meetingId')
  @HttpCode(HttpStatus.OK)
  async deleteMeeting(
    @Param('meetingId') meetingId: string,
    @Request() req
  ) {
    return await this.meetingsService.deleteMeeting(req.user.userId, meetingId);
  }

  @Put(':meetingId/response')
  async respondToMeeting(
    @Param('meetingId') meetingId: string,
    @Body() body: { status: AttendeeStatus },
    @Request() req
  ) {
    return await this.meetingsService.updateAttendeeStatus(
      req.user.userId,
      meetingId,
      body.status
    );
  }
}
