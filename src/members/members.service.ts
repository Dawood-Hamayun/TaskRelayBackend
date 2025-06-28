// backend/src/members/members.service.ts - Enhanced with better error handling
import { Injectable, ForbiddenException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);

  constructor(private prisma: PrismaService) {
    this.logger.log('MembersService initialized');
  }

  async updateMemberRole(
    projectId: string,
    memberId: string,
    newRole: Role,
    requestingUserId: string
  ) {
    this.logger.log('Updating member role:', { projectId, memberId, newRole, requestingUserId });

    // Validate inputs
    if (!projectId || !memberId || !newRole || !requestingUserId) {
      throw new BadRequestException('Missing required parameters');
    }

    // Check if requesting user has permission to change roles
    const requestingMember = await this.prisma.member.findFirst({
      where: {
        userId: requestingUserId,
        projectId,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    });

    if (!requestingMember) {
      throw new ForbiddenException('You do not have permission to change member roles');
    }

    // Get the member being updated
    const targetMember = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    if (!targetMember) {
      throw new NotFoundException('Member not found');
    }

    if (targetMember.projectId !== projectId) {
      throw new BadRequestException('Member does not belong to this project');
    }

    // Role change rules
    const canChangeRole = this.canChangeRole(
      requestingMember.role,
      targetMember.role,
      newRole,
      requestingUserId === targetMember.userId
    );

    if (!canChangeRole.allowed) {
      throw new ForbiddenException(canChangeRole.reason);
    }

    // Special case: Transferring ownership
    if (newRole === 'OWNER') {
      return this.transferOwnership(projectId, targetMember.userId, requestingUserId);
    }

    // Update the role
    const updatedMember = await this.prisma.member.update({
      where: { id: memberId },
      data: { role: newRole },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    this.logger.log('Member role updated successfully');
    return {
      ...updatedMember,
      user: {
        ...updatedMember.user,
        avatar: this.generateAvatar(updatedMember.user.name || updatedMember.user.email),
        color: this.generateUserColor(updatedMember.user.id, 0)
      }
    };
  }

  async removeMember(
    projectId: string,
    memberId: string,
    requestingUserId: string
  ) {
    this.logger.log('Removing member:', { projectId, memberId, requestingUserId });

    // Validate inputs
    if (!projectId || !memberId || !requestingUserId) {
      throw new BadRequestException('Missing required parameters');
    }

    // Get the member being removed first to check permissions
    const targetMember = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    if (!targetMember) {
      throw new NotFoundException('Member not found');
    }

    if (targetMember.projectId !== projectId) {
      throw new BadRequestException('Member does not belong to this project');
    }

    // Check if it's the user removing themselves
    const isSelfRemoval = requestingUserId === targetMember.userId;

    if (!isSelfRemoval) {
      // Check if requesting user has permission to remove members
      const requestingMember = await this.prisma.member.findFirst({
        where: {
          userId: requestingUserId,
          projectId,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      });

      if (!requestingMember) {
        throw new ForbiddenException('You do not have permission to remove members');
      }

      // Removal rules
      const canRemove = this.canRemoveMember(
        requestingMember.role,
        targetMember.role,
        isSelfRemoval
      );

      if (!canRemove.allowed) {
        throw new ForbiddenException(canRemove.reason);
      }
    }

    // Prevent removing the last owner
    if (targetMember.role === 'OWNER') {
      const ownerCount = await this.prisma.member.count({
        where: {
          projectId,
          role: 'OWNER'
        }
      });

      if (ownerCount <= 1) {
        throw new BadRequestException('Cannot remove the last owner. Transfer ownership first.');
      }
    }

    // Remove the member
    await this.prisma.member.delete({
      where: { id: memberId }
    });

    this.logger.log('Member removed successfully');
    return { message: 'Member removed successfully' };
  }

  private async transferOwnership(
    projectId: string,
    newOwnerId: string,
    currentOwnerId: string
  ) {
    this.logger.log('Transferring ownership:', { projectId, newOwnerId, currentOwnerId });

    return this.prisma.$transaction(async (tx) => {
      // Update current owner to admin
      await tx.member.updateMany({
        where: {
          projectId,
          userId: currentOwnerId,
          role: 'OWNER'
        },
        data: { role: 'ADMIN' }
      });

      // Find the target member
      const targetMember = await tx.member.findFirst({
        where: {
          userId: newOwnerId,
          projectId
        }
      });

      if (!targetMember) {
        throw new NotFoundException('Target member not found in project');
      }

      // Update new member to owner
      const newOwner = await tx.member.update({
        where: { id: targetMember.id },
        data: { role: 'OWNER' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      this.logger.log('Ownership transferred successfully');
      return {
        ...newOwner,
        user: {
          ...newOwner.user,
          avatar: this.generateAvatar(newOwner.user.name || newOwner.user.email),
          color: this.generateUserColor(newOwner.user.id, 0)
        }
      };
    });
  }

  private canChangeRole(
    requestingRole: Role,
    targetCurrentRole: Role,
    targetNewRole: Role,
    isSelf: boolean
  ): { allowed: boolean; reason?: string } {
    // Owners can change anyone's role (except other owners unless it's themselves)
    if (requestingRole === 'OWNER') {
      if (targetCurrentRole === 'OWNER' && !isSelf) {
        return { allowed: false, reason: 'Cannot change another owner\'s role' };
      }
      return { allowed: true };
    }

    // Admins can change member/viewer roles but not owner/admin roles
    if (requestingRole === 'ADMIN') {
      if (targetCurrentRole === 'OWNER') {
        return { allowed: false, reason: 'Cannot change owner\'s role' };
      }
      if (targetCurrentRole === 'ADMIN' && !isSelf) {
        return { allowed: false, reason: 'Cannot change another admin\'s role' };
      }
      if (targetNewRole === 'OWNER') {
        return { allowed: false, reason: 'Cannot promote to owner' };
      }
      return { allowed: true };
    }

    // Members and viewers cannot change roles
    return { allowed: false, reason: 'Insufficient permissions' };
  }

  private canRemoveMember(
    requestingRole: Role,
    targetRole: Role,
    isSelf: boolean
  ): { allowed: boolean; reason?: string } {
    // Members can leave the project themselves
    if (isSelf && ['MEMBER', 'VIEWER'].includes(requestingRole)) {
      return { allowed: true };
    }

    // Owners can remove anyone except other owners (unless removing themselves)
    if (requestingRole === 'OWNER') {
      if (targetRole === 'OWNER' && !isSelf) {
        return { allowed: false, reason: 'Cannot remove another owner' };
      }
      return { allowed: true };
    }

    // Admins can remove members/viewers but not owners/other admins
    if (requestingRole === 'ADMIN') {
      if (['OWNER', 'ADMIN'].includes(targetRole) && !isSelf) {
        return { allowed: false, reason: 'Cannot remove owner or admin' };
      }
      return { allowed: true };
    }

    return { allowed: false, reason: 'Insufficient permissions' };
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

  private generateUserColor(userId: string, index: number): string {
    const colors = [
      'bg-zinc-600', 'bg-slate-600', 'bg-gray-600', 'bg-stone-600',
      'bg-red-600', 'bg-orange-600', 'bg-amber-600', 'bg-yellow-600',
      'bg-lime-600', 'bg-green-600', 'bg-emerald-600', 'bg-teal-600',
      'bg-cyan-600', 'bg-sky-600', 'bg-blue-600', 'bg-indigo-600',
      'bg-violet-600', 'bg-purple-600', 'bg-fuchsia-600', 'bg-pink-600',
      'bg-rose-600'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
    }
    
    return colors[Math.abs(hash) % colors.length];
  }
}