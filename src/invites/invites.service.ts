import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async createInvite(email: string, projectId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER' = 'MEMBER') {
    return this.prisma.invite.create({
      data: {
        email,
        projectId,
        role,
      },
    });
  }

  async acceptInvite(email: string, userId: string) {
    const invites = await this.prisma.invite.findMany({
      where: { email },
    });

    if (invites.length === 0) throw new NotFoundException('No pending invites found');

    const membersToCreate = invites.map(invite => ({
      userId,
      projectId: invite.projectId,
      role: invite.role,
    }));

    await this.prisma.member.createMany({
      data: membersToCreate,
      skipDuplicates: true,
    });

    await this.prisma.invite.deleteMany({
      where: { email },
    });

    return { message: 'Invite accepted' };
  }

  async getProjectInvites(projectId: string) {
    return this.prisma.invite.findMany({
      where: { projectId },
    });
  }
}