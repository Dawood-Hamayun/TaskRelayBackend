// backend/src/invites/invites.service.ts - Enhanced but simplified
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

  async createInvite(
    email: string, 
    projectId: string, 
    invitedBy: string,
    role: Role = 'MEMBER',
    message?: string
  ) {
    console.log('📧 Creating invite:', { email, projectId, role, invitedBy });

    // Verify inviter has permission to invite
    const inviterMember = await this.prisma.member.findFirst({
      where: {
        userId: invitedBy,
        projectId,
        role: { in: ['OWNER', 'ADMIN'] }
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true, description: true } }
      }
    });

    if (!inviterMember) {
      throw new ForbiddenException('You do not have permission to invite members to this project');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.member.findFirst({
      where: {
        projectId,
        user: { email }
      }
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this project');
    }

    // Check if there's already a pending invite
    const existingInvite = await this.prisma.invite.findFirst({
      where: {
        email,
        projectId,
        status: 'PENDING'
      }
    });

    if (existingInvite) {
      throw new BadRequestException('User already has a pending invite to this project');
    }

    // Generate secure token and expiration
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create invite
    const invite = await this.prisma.invite.create({
      data: {
        email,
        projectId,
        role,
        token,
        status: 'PENDING',
        invitedBy,
        message,
        expiresAt
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Send email notification
    try {
      await this.emailService.sendInviteEmail({
        recipientEmail: email,
        inviterName: inviterMember.user.name || inviterMember.user.email,
        inviterEmail: inviterMember.user.email,
        projectName: inviterMember.project.name,
        projectDescription: inviterMember.project.description,
        role,
        personalMessage: message,
        inviteToken: token,
        expiresAt
      });
      console.log('✅ Invite email sent successfully to:', email, 'with token:', token);
    } catch (emailError) {
      console.error('❌ Failed to send invite email:', emailError);
      // Don't fail the invite creation if email fails
    }

    return invite;
  }

  async getInviteByToken(token: string) {
    console.log('🔍 Getting invite by token');
    
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    // Check if expired and update status
    if (invite.status === 'PENDING' && new Date() > invite.expiresAt) {
      await this.prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'EXPIRED' }
      });
      throw new BadRequestException('Invite has expired');
    }

    return invite;
  }

  async acceptInvite(token: string, userId: string) {
    console.log('✅ Accepting invite:', { token, userId });
    
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException('Invite has already been processed');
    }

    if (new Date() > invite.expiresAt) {
      await this.prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'EXPIRED' }
      });
      throw new BadRequestException('Invite has expired');
    }

    // Verify user email matches invite
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user || user.email !== invite.email) {
      throw new ForbiddenException('This invite is not for your email address');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.member.findFirst({
      where: {
        userId,
        projectId: invite.projectId
      }
    });

    if (existingMember) {
      await this.prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' }
      });
      throw new BadRequestException('You are already a member of this project');
    }

    // Create member and update invite status in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const member = await tx.member.create({
        data: {
          userId,
          projectId: invite.projectId,
          role: invite.role
        },
        include: {
          user: {
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

      await tx.invite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' }
      });

      return member;
    });

    console.log('✅ Invite accepted successfully');

    return {
      message: 'Invite accepted successfully',
      member: result,
      project: invite.project
    };
  }

  async declineInvite(token: string) {
    console.log('❌ Declining invite:', token);
    
    const invite = await this.prisma.invite.findUnique({
      where: { token }
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException('Invite has already been processed');
    }

    await this.prisma.invite.update({
      where: { id: invite.id },
      data: { status: 'DECLINED' }
    });

    return { message: 'Invite declined' };
  }

  async getProjectInvites(projectId: string, userId: string) {
    console.log('📋 Getting project invites:', { projectId, userId });
    
    // Verify user has permission to view invites
    const member = await this.prisma.member.findFirst({
      where: {
        userId,
        projectId,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    });

    if (!member) {
      throw new ForbiddenException('You do not have permission to view invites for this project');
    }

    return this.prisma.invite.findMany({
      where: { 
        projectId,
        status: 'PENDING'
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async cancelInvite(inviteId: string, userId: string) {
    console.log('🗑️ Cancelling invite:', { inviteId, userId });
    
    const invite = await this.prisma.invite.findUnique({
      where: { id: inviteId },
      include: {
        project: {
          include: {
            members: {
              where: {
                userId,
                role: { in: ['OWNER', 'ADMIN'] }
              }
            }
          }
        }
      }
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    const canCancel = invite.invitedBy === userId || 
                     invite.project.members.length > 0;

    if (!canCancel) {
      throw new ForbiddenException('You do not have permission to cancel this invite');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException('Only pending invites can be cancelled');
    }

    await this.prisma.invite.delete({
      where: { id: inviteId }
    });

    return { message: 'Invite cancelled successfully' };
  }

  async resendInvite(inviteId: string, userId: string) {
    console.log('🔄 Resending invite:', { inviteId, userId });
    
    const invite = await this.prisma.invite.findUnique({
      where: { id: inviteId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true
          },
          include: {
            members: {
              where: {
                userId,
                role: { in: ['OWNER', 'ADMIN'] }
              },
              include: {
                user: { select: { name: true, email: true } }
              }
            }
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    const canResend = invite.invitedBy === userId || 
                     invite.project.members.length > 0;

    if (!canResend) {
      throw new ForbiddenException('You do not have permission to resend this invite');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException('Only pending invites can be resent');
    }

    // Generate new token and extend expiration
    const newToken = randomBytes(32).toString('hex');
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const updatedInvite = await this.prisma.invite.update({
      where: { id: inviteId },
      data: {
        token: newToken,
        expiresAt: newExpiresAt
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Send new invite email
    try {
      const currentUser = invite.project.members[0]?.user;
      await this.emailService.sendInviteEmail({
        recipientEmail: invite.email,
        inviterName: currentUser?.name || currentUser?.email || 'Team member',
        inviterEmail: currentUser?.email || '',
        projectName: invite.project.name,
        projectDescription: invite.project.description,
        role: invite.role,
        personalMessage: invite.message,
        inviteToken: newToken,
        expiresAt: newExpiresAt
      });
      console.log('✅ Resend invite email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send resend invite email:', emailError);
    }

    return {
      message: 'Invite resent successfully',
      invite: updatedInvite
    };
  }
}