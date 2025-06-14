import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async scheduleMeeting(projectId: string, title: string, datetime: Date) {
    return this.prisma.meeting.create({
      data: {
        projectId,
        title,
        datetime
      }
    });
  }

  async getProjectMeetings(projectId: string) {
    return this.prisma.meeting.findMany({
      where: { projectId }
    });
  }
}