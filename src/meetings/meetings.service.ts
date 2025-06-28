// backend/src/meetings/meetings.service.ts - FINAL FIX
import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';
import { AttendeeStatus } from '@prisma/client'; // Import the enum

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async createMeeting(userId: string, projectId: string, data: CreateMeetingDto) {
    // Check if user has access to project
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId }
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const meeting = await this.prisma.meeting.create({
      data: {
        title: data.title,
        description: data.description,
        datetime: new Date(data.datetime),
        duration: data.duration || 60,
        location: data.location,
        meetingUrl: data.meetingUrl,
        projectId,
        createdBy: userId,
        attendees: {
          create: [
            { userId, status: AttendeeStatus.ACCEPTED }, // Creator auto-accepts
            ...(data.attendeeIds || [])
              .filter(id => id !== userId)
              .map(id => ({ userId: id, status: AttendeeStatus.PENDING }))
          ]
        }
      },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return this.transformMeetingData(meeting);
  }

  async getProjectMeetings(userId: string, projectId: string, startDate?: string, endDate?: string) {
    // Check project access
    const member = await this.prisma.member.findFirst({
      where: { userId, projectId }
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.datetime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const meetings = await this.prisma.meeting.findMany({
      where: {
        projectId,
        ...dateFilter
      },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        datetime: 'asc'
      }
    });

    return meetings.map(meeting => this.transformMeetingData(meeting));
  }

  async getUserMeetings(userId: string, startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.datetime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const meetings = await this.prisma.meeting.findMany({
      where: {
        OR: [
          { createdBy: userId },
          {
            attendees: {
              some: { userId }
            }
          }
        ],
        ...dateFilter
      },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        datetime: 'asc'
      }
    });

    return meetings.map(meeting => this.transformMeetingData(meeting));
  }

  async updateMeeting(userId: string, meetingId: string, data: UpdateMeetingDto) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        project: {
          include: {
            members: {
              where: { userId }
            }
          }
        }
      }
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    // Check if user can modify meeting (creator or project admin/owner)
    const isCreator = meeting.createdBy === userId;
    const isProjectAdmin = meeting.project.members.some(
      member => ['OWNER', 'ADMIN'].includes(member.role)
    );

    if (!isCreator && !isProjectAdmin) {
      throw new ForbiddenException('You do not have permission to modify this meeting');
    }

    const updatedMeeting = await this.prisma.meeting.update({
      where: { id: meetingId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.datetime && { datetime: new Date(data.datetime) }),
        ...(data.duration && { duration: data.duration }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.meetingUrl !== undefined && { meetingUrl: data.meetingUrl })
      },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return this.transformMeetingData(updatedMeeting);
  }

  async deleteMeeting(userId: string, meetingId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        project: {
          include: {
            members: {
              where: { userId }
            }
          }
        }
      }
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    const isCreator = meeting.createdBy === userId;
    const isProjectAdmin = meeting.project.members.some(
      member => ['OWNER', 'ADMIN'].includes(member.role)
    );

    if (!isCreator && !isProjectAdmin) {
      throw new ForbiddenException('You do not have permission to delete this meeting');
    }

    await this.prisma.meeting.delete({
      where: { id: meetingId }
    });

    return { message: 'Meeting deleted successfully' };
  }

  async updateAttendeeStatus(userId: string, meetingId: string, status: AttendeeStatus) {
    const attendee = await this.prisma.meetingAttendee.findFirst({
      where: {
        userId,
        meetingId
      }
    });

    if (!attendee) {
      throw new NotFoundException('You are not invited to this meeting');
    }

    await this.prisma.meetingAttendee.update({
      where: { id: attendee.id },
      data: { status }
    });

    return { message: 'Response updated successfully' };
  }

  private transformMeetingData(meeting: any) {
    return {
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      datetime: meeting.datetime,
      duration: meeting.duration,
      location: meeting.location,
      meetingUrl: meeting.meetingUrl,
      creator: meeting.creator,
      project: meeting.project,
      attendees: meeting.attendees.map((attendee: any) => ({
        id: attendee.id,
        status: attendee.status,
        user: {
          ...attendee.user,
          avatar: this.generateAvatar(attendee.user.name || attendee.user.email),
          color: this.generateUserColor(attendee.user.id)
        }
      })),
      createdAt: meeting.createdAt
    };
  }

  private generateAvatar(nameOrEmail: string): string {
    if (!nameOrEmail) return '?';
    
    const parts = nameOrEmail.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    
    if (nameOrEmail.includes('@')) {
      const emailParts = nameOrEmail.split('@')[0].split('.');
      if (emailParts.length >= 2) {
        return (emailParts[0][0] + emailParts[1][0]).toUpperCase();
      }
      return nameOrEmail[0].toUpperCase();
    }
    
    return nameOrEmail.slice(0, 2).toUpperCase();
  }

  private generateUserColor(userId: string): string {
    const colors = [
      'bg-zinc-600', 'bg-slate-600', 'bg-gray-600', 'bg-red-600',
      'bg-orange-600', 'bg-amber-600', 'bg-yellow-600', 'bg-lime-600',
      'bg-green-600', 'bg-emerald-600', 'bg-teal-600', 'bg-cyan-600',
      'bg-sky-600', 'bg-blue-600', 'bg-indigo-600', 'bg-violet-600',
      'bg-purple-600', 'bg-fuchsia-600', 'bg-pink-600', 'bg-rose-600'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
    }
    
    return colors[Math.abs(hash) % colors.length];
  }
}