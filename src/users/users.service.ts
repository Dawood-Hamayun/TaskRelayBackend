// backend/src/users/users.service.ts - Debug version with better logging
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, UpdatePasswordDto, UpdateProfilePictureDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      }
    });
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            members: true,
            comments: true,
            sentInvites: true,
            createdMeetings: true,
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateData: UpdateUserDto) {
    console.log('🔄 Updating user profile:', { userId, updateData });
    
    // Check if email is being changed and if it's already taken
    if (updateData.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        throw new BadRequestException('Email is already taken');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateData.name,
        email: updateData.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            members: true,
            comments: true,
            sentInvites: true,
            createdMeetings: true,
          }
        }
      }
    });

    console.log('✅ Profile updated successfully:', updatedUser);
    return updatedUser;
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;

    console.log('🔐 Updating password for user:', userId);

    // Get user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    console.log('✅ Password updated successfully');
    return { message: 'Password updated successfully' };
  }

  async updateAvatar(userId: string, updateAvatarDto: UpdateProfilePictureDto) {
    console.log('📷 Updating avatar for user:', userId);
    console.log('📷 Avatar data received:', {
      hasAvatar: !!updateAvatarDto.avatar,
      avatarLength: updateAvatarDto.avatar?.length || 0,
      avatarStart: updateAvatarDto.avatar?.substring(0, 50) || 'N/A'
    });
    
    try {
      // Basic validation
      if (!updateAvatarDto.avatar) {
        throw new BadRequestException('Avatar data is required');
      }

      // Check if it's a valid base64 data URL
      if (!updateAvatarDto.avatar.startsWith('data:image/')) {
        throw new BadRequestException('Avatar must be a valid image data URL');
      }

      // Validate base64 image size (optional - prevent huge images)
      const base64Data = updateAvatarDto.avatar.split(',')[1];
      if (base64Data) {
        const sizeInBytes = (base64Data.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        console.log('📏 Avatar size:', { sizeInBytes, sizeInMB });
        
        if (sizeInMB > 5) {
          throw new BadRequestException('Avatar image must be less than 5MB');
        }
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: updateAvatarDto.avatar },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          createdAt: true,
          _count: {
            select: {
              members: true,
              comments: true,
              sentInvites: true,
              createdMeetings: true,
            }
          }
        }
      });

      console.log('✅ Avatar updated successfully');
      return updatedUser;
    } catch (error) {
      console.error('❌ Error updating avatar:', error);
      throw error;
    }
  }

  async removeAvatar(userId: string) {
    console.log('🗑️ Removing avatar for user:', userId);
    
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            members: true,
            comments: true,
            sentInvites: true,
            createdMeetings: true,
          }
        }
      }
    });

    console.log('✅ Avatar removed successfully');
    return updatedUser;
  }

  async deleteAccount(userId: string, password: string) {
    console.log('💥 Deleting account for user:', userId);
    
    // Get user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    // Delete user (cascade will handle related data)
    await this.prisma.user.delete({
      where: { id: userId }
    });

    console.log('✅ Account deleted successfully');
    return { message: 'Account deleted successfully' };
  }

  async getUserStats(userId: string) {
    console.log('📊 Getting stats for user:', userId);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        members: {
          include: {
            project: {
              include: {
                tasks: true
              }
            }
          }
        },
        comments: true,
        sentInvites: true,
        createdMeetings: true,
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate stats
    const totalProjects = user.members.length;
    
    // Get all tasks from user's projects (not just assigned to them)
    const allProjectTasks = user.members.flatMap(member => member.project.tasks);
    
    // Get tasks assigned to this user specifically
    const userMemberIds = user.members.map(m => m.id);
    const assignedTasks = allProjectTasks.filter(task => 
      task.assigneeId && userMemberIds.includes(task.assigneeId)
    );
    
    const completedTasks = assignedTasks.filter(task => task.status === 'DONE').length;
    const inProgressTasks = assignedTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const overdueTasks = assignedTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'
    ).length;

    const stats = {
      totalProjects,
      totalTasks: assignedTasks.length,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalComments: user.comments.length,
      sentInvites: user.sentInvites.length,
      createdMeetings: user.createdMeetings.length,
      completionRate: assignedTasks.length > 0 ? Math.round((completedTasks / assignedTasks.length) * 100) : 0
    };

    console.log('✅ User stats calculated:', stats);
    return stats;
  }
}