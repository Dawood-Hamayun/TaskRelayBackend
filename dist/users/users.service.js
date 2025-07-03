"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getCurrentUser(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateData) {
        console.log('🔄 Updating user profile:', { userId, updateData });
        if (updateData.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    email: updateData.email,
                    NOT: { id: userId }
                }
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Email is already taken');
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
    async updatePassword(userId, updatePasswordDto) {
        const { currentPassword, newPassword } = updatePasswordDto;
        console.log('🔐 Updating password for user:', userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });
        console.log('✅ Password updated successfully');
        return { message: 'Password updated successfully' };
    }
    async updateAvatar(userId, updateAvatarDto) {
        console.log('📷 Updating avatar for user:', userId);
        console.log('📷 Avatar data received:', {
            hasAvatar: !!updateAvatarDto.avatar,
            avatarLength: updateAvatarDto.avatar?.length || 0,
            avatarStart: updateAvatarDto.avatar?.substring(0, 50) || 'N/A'
        });
        try {
            if (!updateAvatarDto.avatar) {
                throw new common_1.BadRequestException('Avatar data is required');
            }
            if (!updateAvatarDto.avatar.startsWith('data:image/')) {
                throw new common_1.BadRequestException('Avatar must be a valid image data URL');
            }
            const base64Data = updateAvatarDto.avatar.split(',')[1];
            if (base64Data) {
                const sizeInBytes = (base64Data.length * 3) / 4;
                const sizeInMB = sizeInBytes / (1024 * 1024);
                console.log('📏 Avatar size:', { sizeInBytes, sizeInMB });
                if (sizeInMB > 5) {
                    throw new common_1.BadRequestException('Avatar image must be less than 5MB');
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
        }
        catch (error) {
            console.error('❌ Error updating avatar:', error);
            throw error;
        }
    }
    async removeAvatar(userId) {
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
    async deleteAccount(userId, password) {
        console.log('💥 Deleting account for user:', userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Password is incorrect');
        }
        await this.prisma.user.delete({
            where: { id: userId }
        });
        console.log('✅ Account deleted successfully');
        return { message: 'Account deleted successfully' };
    }
    async getUserStats(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
        const totalProjects = user.members.length;
        const allProjectTasks = user.members.flatMap(member => member.project.tasks);
        const userMemberIds = user.members.map(m => m.id);
        const assignedTasks = allProjectTasks.filter(task => task.assigneeId && userMemberIds.includes(task.assigneeId));
        const completedTasks = assignedTasks.filter(task => task.status === 'DONE').length;
        const inProgressTasks = assignedTasks.filter(task => task.status === 'IN_PROGRESS').length;
        const overdueTasks = assignedTasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE').length;
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map